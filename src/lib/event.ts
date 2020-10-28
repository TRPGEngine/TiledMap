interface EventPayload {
  [key: string]: any;
}

type EventCb = (payload?: EventPayload) => void;

interface EventListers {
  [event: string]: Set<EventCb>;
}

/**
 * 一个简易的事件总线
 * 所有的事件都经过这个工具进行分发
 */
export class EventBus {
  private listeners: EventListers = {};

  on(eventName: string, cb: EventCb) {
    if (typeof cb !== 'function') {
      console.warn('[EventBus] cb should be a Function');
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }

    this.listeners[eventName].add(cb);
  }

  off(eventName: string, cb: EventCb) {
    if (this.listeners[eventName] && this.listeners[eventName].has(cb)) {
      this.listeners[eventName].delete(cb);
    }
  }

  offAll(eventName: string) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].clear();
    }
  }

  fire(eventName: string, payload?: EventPayload) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((cb) => {
        if (typeof cb === 'function') {
          cb(payload);
        }
      });
    }
  }
}
