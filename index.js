const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { default: axios } = require("axios");
const moment = require("moment");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

function createHash(value) {
  const hash = crypto
    .createHash("sha256")
    .update(value)
    .digest("hex")
    .toString();
  return hash;
}

function isOlderThanSevenDays(eventDate) {
  let date = new Date(eventDate);
  let days = [];
  let eventD = moment(eventDate);
  for (i = 0; i < 7; i++) {
    let day = eventD.subtract(i, "days");
    console.log(day.format("d"));
    days = day.format("d")
  }

  console.log(days);
  
  if (days.length > 7) {
    return "Add";
  } else {
    return "Dont";
  }
}



console.log(isOlderThanSevenDays("2021-08-20T08:41:42.117Z"));
// console.log(days);

app.get("/", async (req, res) => {
  const {
    em,
    eventID,
    eventtype,
    userAgent,
    fblicd,
    source,
    timestamp,
    eventDate,
    ph,
    fn,
    ln,
  } = req.query;

  const PIXEL_ID = "452887915731270";
  const TEST_EVENT_CODE = "TEST6765";
  // const ACCESS_TOKEN =
  //   "EAAQo56QnFoMBAKS6uDBwwCcrln2srlXThP7j7FibN8uJeKHEnFjUCm0BquB6DhkN36daVMH7LmNhZB15N9g2he708xv7RUUDVmbvkvXK5ZCs8g9ZAssGI943cI8Mqt70VCqUsZAHXLZA7sLmiLAPKxHRQfcTl58XYE6ZCjfHZBZCIkZCdeXxZAW7gS7LSL3vUIZC94ZD";
  const ACCESS_TOKEN =
    "EAAQo56QnFoMBAI29T6Y19rMJ4TdqVJsF0bnDexv24mmw7N5YzNbPEeVXG7m5MCZAy0Xm8s23ZCZBdyyHtQ5VyGHIE5qWT7wBTkZCjZCoZCMHUiDy6AjgEtNuthBBtYeMB6jr4DwZCDqdjCxGgpeN8JrPFkiFdZBfsdybzTFZCnwZBXGODxr1yZBF2OVooZAHJrKGKFkZD";

  const data = JSON.stringify({
    data: [
      {
        event_name: eventtype,
        event_time: eventID,
        event_id: "event.id." + eventID,
        event_source_url: source,
        user_data: {
          client_user_agent: userAgent,
          em: createHash(em),
          fn: createHash(fn),
          ln: createHash(ln),
          ph: createHash(ph),
          // fbc: fblicd != "" ? fblicd : null,
          // fbp: "fb.1.1558571054389.1098115397",
        },
      },
    ],
    test_event_code: TEST_EVENT_CODE,
  });

  try {
    const url = `https://graph.facebook.com/v11.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json(response.data);
  } catch (error) {
    res.json(error.response.data);
  }
});

app.listen(PORT, () => console.log("Backend Running on port: " + PORT));
