export interface IController {
  initialize: (...args: unknown[]) => void;
  reset: () => void;
}
