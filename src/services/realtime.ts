import { BroadcastMessage, MatchSnapshot } from '../types/match';

const CHANNEL_NAME = 'belihuloya-scoreboard';

class RealtimeChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(message: BroadcastMessage) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
          if (event.data && event.data.type === 'MATCH_STATE_UPDATED') {
            this.listeners.forEach((listener) => listener(event.data));
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization failed, falling back to local events:', err);
      }
    }
  }

  public broadcast(snapshot: MatchSnapshot, lastSavedTime: string, updatedAt: number): void {
    const message: BroadcastMessage = {
      type: 'MATCH_STATE_UPDATED',
      payload: {
        ...snapshot,
        lastSavedTime,
        updatedAt,
      },
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.warn('Failed to postMessage via BroadcastChannel:', err);
      }
    }

    // Also notify any same-window listeners
    this.listeners.forEach((listener) => listener(message));
  }

  public subscribe(callback: (message: BroadcastMessage) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeChannel();
