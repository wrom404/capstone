// function sendSms(phoneNumber, message) {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;
//   const client = require('twilio')(accountSid, authToken);

//   return client.messages
//     .create({
//       body: message,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phoneNumber,
//     })
//     .then((message) => console.log(message.sid))
//     .catch((err) => console.log(err));
// }

function sendSms(clientNumber, date, startTime, endTime) {
  const now = new Date().getTime(); // Current timestamp
  const endTimestamp = new Date(endTime).getTime(); // Convert end time to timestamp
  const triggerTime = endTimestamp - 3 * 60 * 1000; // 3 minutes before end time

  const delay = triggerTime - now; // Calculate delay

  if (delay > 0) {
    setTimeout(() => {
      console.log("inside sendSms");
      // Here, you can add the actual SMS sending logic
    }, delay);
  } else {
    console.log("End time is too close or already passed.");
  }
}

export default sendSms;
