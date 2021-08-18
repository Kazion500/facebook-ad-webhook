const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { default: axios } = require("axios");
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

app.get("/", async (req, res) => {
  const { email, eventDate, eventID, eventType, fblicd, source, phone } =
    req.query;
  const PIXEL_ID = "452887915731270";
  const TEST_EVENT_CODE = "TEST12907";
  const ACCESS_TOKEN =
    "EAAQo56QnFoMBAKS6uDBwwCcrln2srlXThP7j7FibN8uJeKHEnFjUCm0BquB6DhkN36daVMH7LmNhZB15N9g2he708xv7RUUDVmbvkvXK5ZCs8g9ZAssGI943cI8Mqt70VCqUsZAHXLZA7sLmiLAPKxHRQfcTl58XYE6ZCjfHZBZCIkZCdeXxZAW7gS7LSL3vUIZC94ZD";
  const data = JSON.stringify({
    data: [
      {
        event_name: eventType,
        event_time: eventID,
        event_id: "event.id." + eventID,
        event_source_url: source,
        user_data: {
          //   client_ip_address: "192.19.9.9",
          //   client_user_agent: "test ua",
          em: createHash(email),

          ph: createHash(phone),
          fbc: fblicd,
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
