import { IController } from "./IController";

class CanvasResizeObserver implements IController {
  _rs: ResizeObserver;
  /**
   * Initialize resize observer
   * @param source html element canvas parent
   * @param target canvas element
   * @param callback function to call when size change
   * @returns ResizeObserver
   */
  initialize = (
    source: HTMLElement,
    target: HTMLCanvasElement,
    callback: () => void,
  ) => {
    target.width = source.clientWidth;
    target.height = source.clientHeight;
    const rs = new ResizeObserver((elements) => {
      const source = elements[0].target as unknown as HTMLElement;
      target.width = source.clientWidth;
      target.height = source.clientHeight;
      callback();
    });
    rs.observe(source);
    return rs;
  };

  reset = () => {
    this._rs?.disconnect();
  };
}

export default CanvasResizeObserver;
