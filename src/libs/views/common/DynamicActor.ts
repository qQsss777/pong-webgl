import Actor from "./Actor";

interface IDynamicActorProperties {
  color: [number, number, number, number];
}
abstract class DynamicActor extends Actor implements IDynamicActorProperties {
  color: [number, number, number, number];
  protected direction = true;
  constructor(props: IDynamicActorProperties) {
    super();
    this.color = props.color;
  }
}

export default DynamicActor;
