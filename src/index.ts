import { Context, APIGatewayEvent, Callback } from "aws-lambda";
import axios from "axios";
import get from "lodash.get";

import { ICocono, ICoconoStack, ICoconoParam } from "./object";

function value(param: string | ICoconoParam, obj: any): any {
  if (param instanceof Object) {
    const value = get(obj, (param as ICoconoParam).ref);
    console.log(`param is reference, retrieve ref -> r: ${value}`);
    return value;
  }
  console.log(`param is string, use raw value: ${param}`);
  return param;
}

function filter(stack: ICoconoStack, obj: any): boolean {
  switch (stack.ops) {
    case "!=":
      console.log("operation is !=");
      return value(stack.params[0], obj) != value(stack.params[1], obj);

    case "==":
      console.log("operation is ==");
      return value(stack.params[0], obj) == value(stack.params[1], obj);

    case "~=":
      console.log("operation is ~=");
      return RegExp(value(stack.params[1], obj)).test(value(stack.params[0], obj));
  }
  return false;
}

exports.handler = (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  if (event.body === null) {
    return callback(null, { statusCode: 403, body: JSON.stringify({ status: "fail" }) });
  }

  const body = JSON.parse(event.body);
  if (!body._cocono) {
    return callback(null, { statusCode: 403, body: JSON.stringify({ status: "fail" }) });
  }

  const cocono = body._cocono as ICocono;

  if (cocono.stacks.length > 0) {
    let r: boolean = true;
    for (let stack of cocono.stacks) {
      switch (stack.type) {
        case "filter":
          r = r && filter(stack, body);
          break;
      }

      if (!r) {
        return callback(null, { statusCode: 200, body: JSON.stringify({ status: "skip" }) });
      }
    }
  }

  delete body._cocono;

  console.log(`Request to ${cocono.relay_to} with body ${JSON.stringify(body)}`);
  axios.post(cocono.relay_to, body).then(_ => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ status: "success" })
    });
  }).catch(error => {
    console.log(error);
    callback(null, {
      statusCode: 403,
      body: JSON.stringify({ status: "error" })
    });
  });
};