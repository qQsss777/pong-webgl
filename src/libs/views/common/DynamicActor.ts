import Actor from "./Actor";

interface IDynamicActorConstructor {
  color: [number, number, number, number];
}

interface IDynamicActorProperties extends IDynamicActorConstructor {
  increaseLevel: () => void;
}

abstract class DynamicActor extends Actor implements IDynamicActorProperties {
  color: [number, number, number, number];
  protected direction = true;
  constructor(props: IDynamicActorConstructor) {
    super();
    this.color = props.color;
  }

  abstract increaseLevel: () => void;
}

export default DynamicActor;
