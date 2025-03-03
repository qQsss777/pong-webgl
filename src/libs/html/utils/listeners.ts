export const canvasResizeObserver = (
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
