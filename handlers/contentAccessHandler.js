import { log } from "../utils/log.js";
import path from "path";

export function contentAccessHandler(req, res) {
  const startTime = Date.now();
  try {
    log("Processing content access request");
    
    // Send the paywalled content page
    res.sendFile(path.join(process.cwd(), "public", "paywalled-content.html"));
    
    log(`Request completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    log("Error serving content:", "error", error);
    res.status(500).send({
      error: "Failed to serve content",
      message: error.message,
    });
  }
}