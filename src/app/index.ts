import { Context, APIGatewayEvent, Callback } from "aws-lambda";
import axios from "axios";

import { ICocono } from "./object";
import { createStack } from "./stacks";

exports.handler = (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  if (event.body === null) {
    // Bad Request
    return callback(null, { statusCode: 400, body: JSON.stringify({ status: "fail" }) });
  }

  const body = JSON.parse(event.body);
  if (!body._cocono) {
    // Bad Request
    return callback(null, { statusCode: 400, body: JSON.stringify({ status: "fail" }) });
  }

  const cocono = body._cocono as ICocono;

  if (cocono.stacks.length > 0) {
    let r: boolean = true;
    for (let stack of cocono.stacks.map(w => createStack(w, body))) {
      r = r && stack.run();

      if (!r) {
        return callback(null, { statusCode: 200, body: JSON.stringify({ status: "skip" }) });
      }
    }

  }

  delete body._cocono;

  axios.post(cocono.relay_to, body).then(_ => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ status: "success" })
    });
  }).catch(error => {
    // Internal Server Error
    console.error(error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ status: "error" })
    });
  });
};