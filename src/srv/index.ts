import { Context, SNSEvent, Callback } from "aws-lambda";
import axios from "axios";

exports.onAlarm = (event: SNSEvent, _context: Context, callback: Callback) => {
  axios.post(process.env.DISCORD_NOTIFICATION_URL, {
    content: "Failure",
    username: "CoconoStack Alarm"
  });

  callback();
};

exports.onOk = (event: SNSEvent, _context: Context, callback: Callback) => {
  axios.post(process.env.DISCORD_NOTIFICATION_URL, {
    content: "OK",
    username: "CoconoStack Alarm"
  });

  callback();
};