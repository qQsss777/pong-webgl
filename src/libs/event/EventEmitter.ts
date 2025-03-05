interface IEventEmitterProperties {
  subscribe: (event: string, cb: (data: unknown) => void) => void;
  dispatch: (event: string, data: unknown) => void;
}

/**
 * Class to dispatch event and accept subscriber
 */
class EventEmitter implements IEventEmitterProperties {
  private _events: Record<string, ((data: unknown) => void)[]> = {};

  /**
   * Subscribe to event emit
   * @param event event name
   * @param cb callback
   * @returns function to remove event listener
   */
  subscribe = (event: string, cb: (data: unknown) => void): (() => void) => {
    if (event in this._events) {
      this._events[event].push(cb);
    } else {
      this._events[event] = [cb];
    }
    return () =>
      (this._events[event] = this._events[event].filter((fn) => fn !== cb));
  };

  /**
   * Emit event
   * @param event event name
   * @param data
   */
  dispatch = (event: string, data: unknown) => {
    if (event in this._events) {
      this._events[event].forEach((cb) => {
        cb(data);
      });
    }
  };
}

export default EventEmitter;
