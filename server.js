require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.static(path.join(__dirname)));

app.get("/api/weather", async (req, res) => {
  const location = (req.query.location || "").toString().trim();

  if (!location) {
    return res.status(400).json({ error: "Query param 'location' is required." });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "Server is missing VISUAL_CROSSING_API_KEY." });
  }

  const encodedLocation = encodeURIComponent(location);
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const rawBody = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Weather provider request failed.",
        details: rawBody || `Status ${response.status}`
      });
    }

    const data = JSON.parse(rawBody);
    return res.json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Unable to fetch weather data from provider.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Weather app running at http://localhost:${PORT}`);
});
