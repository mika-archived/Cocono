import { Context, APIGatewayEvent, Callback } from "aws-lambda";

exports.handler = (_event: APIGatewayEvent, _context: Context, callback: Callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ status: "ok" })
  });
};