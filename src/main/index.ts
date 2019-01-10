import { Context, APIGatewayEvent, Callback } from "aws-lambda";
import axios from "axios";

import { ICocono } from "./object";
import { createStack } from "./stacks";

export const handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  if (!event.body) {
    return callback("Bad Request: body is empty, please use direct hook");
  }

  const body = JSON.parse(event.body);
  if (!body._cocono) {
    return callback("Bad Request: _cocono property is empty, please use direct hook")
  }

  const cocono = body._cocono as ICocono;
  if (cocono.stacks.length > 0) {
    const r = cocono.stacks.map(w => createStack(w, body)).every(w => w.run());
    if (!r) {
      return callback(null, { statusCode: 200, body: JSON.stringify({ status: "ok", message: "Several stacks returned false value." }) });
    }
  }

  delete body._cocono;

  try {
    await axios.post(cocono.relay_to, body);
    callback(null, { statusCode: 200, body: JSON.stringify({ status: "ok", message: "Relay success." }) });
  } catch (err) {
    console.error(err);
    callback(`Failed to relay request : ${err}`);
  }
};
