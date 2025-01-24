import { WeatherArgs, RequestContext } from "../types";

interface WeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

const WEATHER_CODES: Record<number, string> = {
  0: "clear sky",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "foggy",
  48: "depositing rime fog",
  51: "light drizzle",
  53: "moderate drizzle",
  55: "dense drizzle",
  61: "slight rain",
  63: "moderate rain",
  65: "heavy rain",
  71: "slight snow fall",
  73: "moderate snow fall",
  75: "heavy snow fall",
  95: "thunderstorm",
};

export async function getWeather(
  args: WeatherArgs,
  context: RequestContext
): Promise<string> {
  try {
    const { location } = args;
    const contact = context.contact;

    // If contact has location, use their coordinates
    const lat = contact?.location?.latitude || 51.5074; // Default to London
    const lon = contact?.location?.longitude || -0.1278;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = (await response.json()) as WeatherResponse;
    const { temperature_2m, weather_code } = data.current;
    const weather = WEATHER_CODES[weather_code] || "unknown conditions";

    return `Hello ${
      contact?.name || "there"
    }! The weather in ${location} is ${weather} with ${temperature_2m}°C`;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return `Sorry, I couldn't fetch the weather information for ${args.location}`;
  }
}
