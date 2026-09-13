import '@testing-library/jest-dom';

// In-memory mock for localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  static channels: Record<string, Set<MockBroadcastChannel>> = {};

  constructor(name: string) {
    this.name = name;
    if (!MockBroadcastChannel.channels[name]) {
      MockBroadcastChannel.channels[name] = new Set();
    }
    MockBroadcastChannel.channels[name].add(this);
  }

  postMessage(data: unknown) {
    const listeners = MockBroadcastChannel.channels[this.name];
    if (listeners) {
      listeners.forEach((ch) => {
        if (ch !== this && ch.onmessage) {
          ch.onmessage(new MessageEvent('message', { data }));
        }
      });
    }
  }

  close() {
    if (MockBroadcastChannel.channels[this.name]) {
      MockBroadcastChannel.channels[this.name].delete(this);
    }
  }
}

(global as unknown as { BroadcastChannel: unknown }).BroadcastChannel = MockBroadcastChannel;
