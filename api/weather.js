module.exports = async (req, res) => {
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    return res.status(204).end();
  }

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const location = (req.query?.location || "").toString().trim();
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;

  if (!location) {
    return res.status(400).json({ error: "Query param 'location' is required." });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Server missing VISUAL_CROSSING_API_KEY." });
  }

  const encodedLocation = encodeURIComponent(location);
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?key=${apiKey}`;

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
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Unable to fetch weather data from provider.",
      details: error.message
    });
  }
};