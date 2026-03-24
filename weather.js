const currentConditionInfoEl = document.querySelector(".current-condition-info");
const infoContainerEl = document.querySelector(".info-container");
const statusMessageEl = document.querySelector(".status-message");
const addressInputEl = document.querySelector(".address-input");
const searchButtonEl = document.querySelector(".search-button");
const searchFormEl = document.querySelector("#search-form");

function fahrenheitToCelsius(temp) {
  return `${((Number(temp) - 32) * 5 / 9).toFixed(1)} deg C`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setStatus(message, type = "") {
  statusMessageEl.textContent = message;
  statusMessageEl.classList.remove("error", "success");

  if (type) {
    statusMessageEl.classList.add(type);
  }
}

function setLoadingState(isLoading) {
  addressInputEl.disabled = isLoading;
  searchButtonEl.disabled = isLoading;
  searchButtonEl.textContent = isLoading ? "Searching..." : "Search";
}

function getApiBaseUrl() {
  const { hostname, port } = window.location;

  if ((hostname === "localhost" || hostname === "127.0.0.1") && port !== "3000") {
    return "http://localhost:3000";
  }

  return "";
}

function getWeatherApiUrl(encodedAddress) {
  const baseUrl = getApiBaseUrl();

  if (baseUrl) {
    return `${baseUrl}/api/weather?location=${encodedAddress}`;
  }

  return `/api/weather?location=${encodedAddress}`;
}

function displayCurrentCondition(address, currentConditions) {
  currentConditionInfoEl.innerHTML = `
    <div class="item"><strong>Location:</strong> ${escapeHtml(address)}</div>
    <div class="item"><strong>Local Time:</strong> ${escapeHtml(currentConditions.datetime)}</div>
    <div class="item"><strong>Temperature:</strong> ${fahrenheitToCelsius(currentConditions.temp)}</div>
    <div class="item"><strong>Condition:</strong> ${escapeHtml(currentConditions.conditions)}</div>
  `;
}

function displayNextDays(days) {
  const next15Days = days.slice(0, 15);

  const daysHtml = next15Days.map((day) => `
    <div class="day-info" role="row">
      <div>${escapeHtml(day.datetime)}</div>
      <div>${fahrenheitToCelsius(day.temp)}</div>
      <div>${fahrenheitToCelsius(day.tempmin)}</div>
      <div>${fahrenheitToCelsius(day.tempmax)}</div>
      <div>${escapeHtml(day.conditions)}</div>
    </div>
  `).join("");

  infoContainerEl.innerHTML = daysHtml;
}

async function weatherInfo(inputAddress) {
  const trimmedAddress = inputAddress.trim();

  if (!trimmedAddress) {
    setStatus("Please enter a location before searching.", "error");
    return;
  }

  setLoadingState(true);
  setStatus("Loading weather data...");

  try {
    if (window.location.protocol === "file:") {
      throw new Error("OPEN_WITH_SERVER");
    }

    const encodedAddress = encodeURIComponent(trimmedAddress);
    const response = await fetch(getWeatherApiUrl(encodedAddress));

    if (!response.ok) {
      let serverMessage = "";

      try {
        const errorPayload = await response.json();
        serverMessage = errorPayload.error || errorPayload.details || "";
      } catch (_) {
        // Ignore JSON parse errors and use fallback message below.
      }

      throw new Error(serverMessage || `Weather API failed with status ${response.status}`);
    }

    const data = await response.json();
    const { address, currentConditions, days } = data;

    if (!currentConditions || !Array.isArray(days)) {
      throw new Error("Weather API returned an unexpected response.");
    }

    displayCurrentCondition(address, currentConditions);
    displayNextDays(days);
    setStatus(`Forecast updated for ${address}.`, "success");
  } catch (error) {
    currentConditionInfoEl.innerHTML = "";
    infoContainerEl.innerHTML = "";

    if (error.message === "OPEN_WITH_SERVER") {
      setStatus("Open the app at http://localhost:3000 (not as a local file) and try again.", "error");
    } else {
      setStatus(`Could not fetch weather data. ${error.message} Ensure local server is running or Netlify env var is set.`, "error");
    }

    console.error(error);
  } finally {
    setLoadingState(false);
  }
}

searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  weatherInfo(addressInputEl.value);
});

weatherInfo("Bhopal");