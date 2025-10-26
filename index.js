import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_USER_ID = process.env.LINE_USER_ID;

app.post("/tv-webhook", async (req, res) => {
  try {
    const payload = req.body;

    const textMessage =
      `[ALERT]\n` +
      `Signal: ${payload.signal}\n` +
      `Symbol: ${payload.ticker}\n` +
      `TF: ${payload.tf}\n` +
      `Price: ${payload.price}\n` +
      `Time: ${payload.time}\n` +
      `Enter NEXT candle!`;

    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_TOKEN}`
      },
      body: JSON.stringify({
        to: LINE_USER_ID,
        messages: [{ type: "text", text: textMessage }]
      })
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

app.get("/", (_, res) => res.send("LINE Webhook Alive ✅"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));
