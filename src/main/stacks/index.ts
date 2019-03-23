import { StackBase } from "./StackBase";
import { ICoconoStack } from "../object";

// imports
import { FilterStack } from "./FilterStack";

function createStack(stack: ICoconoStack, obj: any): StackBase<ICoconoStack> {
  switch (stack.type) {
    case "filter":
      return new FilterStack(stack, obj);
  }
}

export { createStack };
