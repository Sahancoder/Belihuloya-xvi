import { MatchState } from '../types/match';
import { sanitizeState } from './persistence';

const CHANNEL_NAME = 'belihuloya-scoreboard';

type Listener = (state: MatchState) => void;

/**
 * Keeps control.html and overlay.html in sync on one laptop.
 *
 * 1. BroadcastChannel — instant, works between tabs of the same browser.
 * 2. Local sync endpoint on the Vite server (/api/state + /api/events) — works
 *    between different browsers, e.g. control in Chrome and overlay inside OBS.
 *    No internet needed; it is the same 127.0.0.1 server that serves the pages.
 *
 * On static hosting (Vercel) the endpoint does not exist, so only (1) is used:
 * control and overlay must then run in the same browser — e.g. both inside OBS
 * (Custom Browser Dock + Browser Source).
 */
class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private source: EventSource | null = null;
  private listeners = new Set<Listener>();
  private connectionListeners = new Set<(online: boolean) => void>();
  private serverOnline = false;
  private serverAvailable: Promise<boolean> = Promise.resolve(false);

  constructor() {
    if (typeof window === 'undefined') return;

    if ('BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent) => this.receive(event.data);
      } catch (err) {
        console.warn('BroadcastChannel unavailable:', err);
      }
    }

    if ('EventSource' in window && import.meta.env.MODE !== 'test') {
      this.serverAvailable = fetch('/api/state', { method: 'HEAD', cache: 'no-store' })
        .then((res) => res.ok && res.headers.get('X-Score-Sync') === '1')
        .catch(() => false);
      this.serverAvailable.then((available) => available && this.connectServer());
    }
  }

  private connectServer() {
    const source = new EventSource('/api/events');
    this.source = source;
    source.onopen = () => this.setOnline(true);
    source.onmessage = (event) => {
      try {
        this.receive(JSON.parse(event.data));
      } catch {
        /* ignore malformed frames */
      }
    };
    // EventSource reconnects on its own; just reflect the state.
    source.onerror = () => this.setOnline(false);
  }

  private setOnline(online: boolean) {
    if (this.serverOnline === online) return;
    this.serverOnline = online;
    this.connectionListeners.forEach((l) => l(online));
  }

  private receive(data: unknown) {
    const state = sanitizeState(data);
    if (state) this.listeners.forEach((l) => l(state));
  }

  broadcast(state: MatchState) {
    try {
      this.channel?.postMessage(state);
    } catch (err) {
      console.warn('BroadcastChannel post failed:', err);
    }

    const body = JSON.stringify(state);
    this.serverAvailable.then((available) => {
      if (!available) return;
      fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() =>
        this.setOnline(false)
      );
    });
  }

  async fetchServerState(): Promise<MatchState | null> {
    if (!(await this.serverAvailable)) return null;
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (!res.ok) return null;
      return sanitizeState(await res.json());
    } catch {
      return null;
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onConnection(listener: (online: boolean) => void) {
    this.connectionListeners.add(listener);
    listener(this.serverOnline);
    return () => this.connectionListeners.delete(listener);
  }

  close() {
    this.channel?.close();
    this.source?.close();
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
