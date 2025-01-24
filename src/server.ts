import express, { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { FunctionRequest, WeatherArgs, RequestContext } from "./types";
import { getWeather } from "./services/weather";

dotenv.config();

const app = express();
const TURN_HMAC_SECRET = process.env.TURN_HMAC_SECRET || "";

// Middleware to parse JSON bodies
app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      (req as any).rawBody = buf;
    },
  })
);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express!");
});

// Function calling route
app.post(
  "/function-calling",
  //@ts-ignore
  async (req: Request<{}, {}, FunctionRequest>, res: Response) => {
    console.dir(req.body, { depth: null });

    const { function_name, function_args, context } = req.body;

    console.log(
      `Function ${function_name} was called with args ${JSON.stringify(
        function_args
      )} and context ${JSON.stringify(context)}`
    );

    // Handle function calls
    try {
      switch (function_name) {
        case "get_weather":
          const weatherResponse = await getWeather(function_args as WeatherArgs, context);
          console.log("Weather response:", weatherResponse);
          return res.json({ output: weatherResponse });
        case "some_other_function":
          return res.json({ output: someOtherFunction(function_args, context) });
        default:
          return res.json({ output: "This function is not supported." });
      }
    } catch (error) {
      console.error("Error handling function call:", error);
      return res
        .status(500)
        .json({ output: "An error occurred while processing your request" });
    }
  }
);

// Remove the old weather-related functions
function someOtherFunction(args: Record<string, any>, context: RequestContext): string {
  return "Result from some other function";
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
