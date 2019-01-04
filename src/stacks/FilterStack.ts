import { StackBase } from "./StackBase";
import { ICoconoStack } from "../object";

export interface IFilterStack extends ICoconoStack {
  type: "filter";
  ops: "==" | "!=" | "~=";
}

export class FilterStack extends StackBase<IFilterStack> {
  public name: string = "filter";

  public run(): boolean {
    switch (this.stack.ops) {
      case "==":
        return this.value(this.stack.params[0]) == this.value(this.stack.params[1]);

      case "!=":
        return this.value(this.stack.params[0]) != this.value(this.stack.params[1]);

      case "~=":
        return RegExp(this.value(this.stack.params[1])).test(this.value(this.stack.params[0]));
    }

    return false;
  }
}