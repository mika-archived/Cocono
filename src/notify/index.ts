import { Context, SNSEvent, Callback } from "aws-lambda";
import axios from "axios";

function pack(event: SNSEvent): any {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const state = message.NewStateValue;
  const emoji = state === "ALARM" ? ":warning:" : ":ok_woman:";
  const name = message.AlarmName;
  const reason = message.NewStateReason;

  return {
    // avatar_url: null,
    username: "Cocono Alarm",
    content: `
${emoji} ${state}: ${name}
${reason}
`.trim()
  };
}

export const handler = async (event: SNSEvent, _context: Context, callback: Callback) => {
  try {
    await axios.post(process.env.DISCORD_NOTIFICATION_URL, pack(event));
    callback();
  } catch (err) {
    callback(err);
  }
};
