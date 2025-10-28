import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";
import path from "path";
import { log } from "../utils/log.js";
import { contentAccessHandler } from "../handlers/contentAccessHandler.js";

// Load environment variables from .env.local first, then .env
dotenv.config({ path: ".env.local" });
dotenv.config();

// Validate required environment variables
if (!process.env.WALLET_ADDRESS) {
  // note because x402.org/facillitator is used, it won't accept paments to the
  // burn address. If this occurs you'll see an error on the page that
  // re-requests the payment twice and then shows a payment failure error.
  process.env.WALLET_ADDRESS = "0x0000000000000000000000000000000000000000";
  console.warn(
    "WALLET_ADDRESS environment variable is not set. Using the default burn address."
  );
}

// Create and configure the Express app
const app = express();

// Use Base Sepolia (testnet) for development
const network = "base-sepolia";
const facilitatorObj = { url: "https://x402.org/facilitator" };

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());

// x402 payment middleware configuration
app.use(
  paymentMiddleware(
    process.env.WALLET_ADDRESS, // your receiving wallet address or the default burn address
    {
      // Protected endpoint for authentication
      "GET /authenticate": {
        price: "$0.01", // Set your desired price
        network: network,
      },
    },
    facilitatorObj
  )
);

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  log(`${req.method} ${req.url}`);
  log(`Request Headers: ${JSON.stringify(req.headers)}`);
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Authentication endpoint - just redirects to the authenticated content
app.get("/authenticate", (req, res) => {
  log("Payment successful, redirecting to paywalled content");
  res.redirect("/paywalled-content");
});

// Paywalled content endpoint - serves the authenticated content
app.get("/paywalled-content", contentAccessHandler);

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the app for Vercel serverless functions
export default app;

// Start the server for local development
const PORT = process.env.PORT || 4021;
app.listen(PORT, () => {
  log(`Server is running on http://localhost:${PORT}`);
});
