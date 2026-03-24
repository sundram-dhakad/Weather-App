exports.handler = async (event) => {
  const location = (event.queryStringParameters?.location || "").toString().trim();
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;

  if (!location) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Query param 'location' is required." })
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server missing VISUAL_CROSSING_API_KEY." })
    };
  }

  const encodedLocation = encodeURIComponent(location);
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const rawBody = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Weather provider request failed.",
          details: rawBody || `Status ${response.status}`
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: rawBody
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Unable to fetch weather data from provider.",
        details: error.message
      })
    };
  }
};
