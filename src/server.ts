import express, { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { FunctionRequest, WeatherArgs, RequestContext } from "./types";

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
// @ts-ignore
app.post("/function-calling", (req: Request<{}, {}, FunctionRequest>, res: Response) => {
  console.log("Request body", req.body);
  // Extract signature from headers
  /*  const requestSignature = req.headers["x-turn-hook-signature"] as string;

  // Compute signature of request body
  const rawRequestBody = (req as any).rawBody;
  const hmac = crypto.createHmac("sha256", TURN_HMAC_SECRET);
  hmac.update(rawRequestBody);
  const computedSignature = hmac.digest("base64");

  // Verify signature
  if (!requestSignature || computedSignature !== requestSignature) {
    console.log(`Invalid signature: ${requestSignature}`);
    console.log(`Computed signature is: ${computedSignature}`);
    return res.status(403).send("Invalid signature");
  } */

  const { function_name, function_args, context } = req.body;

  console.log(
    `Function ${function_name} was called with args ${JSON.stringify(
      function_args
    )} and context ${JSON.stringify(context)}`
  );

  // Handle function calls
  switch (function_name) {
    case "get_weather":
      return res.json({ output: getWeather(function_args as WeatherArgs, context) });
    case "some_other_function":
      return res.json({ output: someOtherFunction(function_args, context) });
    default:
      return res.json({ output: "This function is not supported." });
  }
});

function getWeather(args: WeatherArgs, context: RequestContext): string {
  const { location } = args;
  const whatsappId = context.wa_id;
  const name = context.contact?.name;

  console.log("WhatsApp ID", whatsappId);
  console.log("Contact name", name);

  return `The weather for ${location} is sunny and it's 22 degrees`;
}

function someOtherFunction(args: Record<string, any>, context: RequestContext): string {
  return "Result from some other function";
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
