/**
 * Frontend API client for HydraSense.
 *
 * Every call goes through HTTP to the FastAPI backend; the browser never
 * touches SQLite, PostgreSQL or the dataset directly (SRS 2.4).
 *
 * In development the Vite proxy forwards /api/* to http://127.0.0.1:8000.
 * Override the base with VITE_API_BASE (e.g. http://127.0.0.1:8000/api).
 */

const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      // Merge after spreading `options` so a caller-supplied header cannot
      // drop the defaults.
      headers: { Accept: "application/json", ...(options.headers || {}) },
    });
  } catch (cause) {
    throw new ApiError(
      "Cannot reach the HydraSense API. Is the backend running on port 8000?",
      0,
      String(cause),
    );
  }

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const detail =
      body && typeof body.detail === "string"
        ? body.detail
        : `Request failed with HTTP ${response.status}`;
    throw new ApiError(detail, response.status, body);
  }
  return body;
}

const query = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
};

/** Service, dataset and model status. */
export const checkHealth = () => request("/health");

/** Supported stations with coverage metadata. */
export const listStations = () => request("/stations");

/** State -> district -> station tree for the filter selects. */
export const listLocations = () => request("/locations");

/**
 * Historical observations for a station.
 * @param {object} options - { stationId, start, end, limit, aggregate }
 */
export const getHistoricalReadings = ({
  stationId,
  start,
  end,
  limit = 365,
  aggregate = "none",
} = {}) =>
  request(
    `/groundwater${query({
      station_id: stationId,
      start,
      end,
      limit,
      aggregate,
    })}`,
  );

/** Model forecast: { station_id, horizon_days }. */
export const makePrediction = (stationId, horizonDays = 30) =>
  request("/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ station_id: stationId, horizon_days: horizonDays }),
  });

/** Held-out evaluation metrics stored in the model artifact. */
export const getMetrics = () => request("/metrics");

/** Format a water level (metres) for display. */
export const formatLevel = (level) => {
  if (level === null || level === undefined || Number.isNaN(Number(level))) {
    return "N/A";
  }
  return `${Number(level).toFixed(2)} m`;
};

/** Format an ISO date (or YYYY-MM) for display. */
export const formatDate = (value) => {
  if (!value) return "N/A";
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};
