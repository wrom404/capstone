import twilio from "twilio";
// import dotenv from "dotenv";

// dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSms(phoneNumber, date, startTime, endTime) {
  const message = `Your event is confirmed on ${date} from ${startTime} to ${endTime}.`;
  let formattedNumber;

  console.log("accountSid:", accountSid);
  console.log("authToken:", authToken);
  console.log("client:", client);
  console.log("phoneNumber:", phoneNumber);

  if (phoneNumber.startsWith("09") && phoneNumber.length === 11) {
    formattedNumber = "+63" + phoneNumber.slice(1); // Remove the leading '0' and prepend '+63'
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });
    console.log(result.sid);
    return result;
  } catch (err) {
    console.error("SMS Error:", err);
    throw err;
  }
}

export default sendSms;
