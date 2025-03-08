import { IController } from "./IController";
interface IKeyboardEvent {
  name: string;
  callback: (event: unknown) => void;
}
class PlayerController implements IController {
  _eventInfos: IKeyboardEvent[] = [];

  /**
   * Add event listener. Use it to track keyboard press
   * @param eventsInfos
   */
  initialize = (eventsInfos: IKeyboardEvent[]) => {
    eventsInfos.forEach((info) => {
      document.addEventListener(info.name, info.callback);
      this._eventInfos.push(info);
    });
  };

  /**
   * Remove all events listener
   */
  reset = () => {
    this._eventInfos.forEach((info) => {
      document.removeEventListener(info.name, info.callback);
    });
  };
}
export default PlayerController;
