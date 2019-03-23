import get from "lodash/get";
import { ICoconoParam, ICoconoStack } from "../object";

export abstract class StackBase<T extends ICoconoStack> {
  protected readonly stack: T;

  public constructor(stack: ICoconoStack, protected readonly obj: any) {
    this.stack = stack as T;
  }

  public value(param: string | ICoconoParam): any {
    if (param instanceof Object) {
      return get(this.obj, param.ref);
    }
    return param;
  }

  public abstract run(): boolean;
}
