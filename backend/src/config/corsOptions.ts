import { allowedOrigins } from "./allowedOrigins.js";

/**
 * CORS (Cross-Origin Resource Sharing) configuration for the Express server.
 *
 * This configuration controls which origins can access the API endpoints.
 * In development, it allows requests from localhost and specified origins.
 * In production, it should be restricted to your frontend domain(s).
 *
 * The origin function checks if the requesting origin is in the allowedOrigins array
 * or if it's a same-origin request (no origin header). This prevents unauthorized
 * cross-origin requests while allowing legitimate frontend applications to access
 * the API.
 */

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (allowedOrigins.indexOf(origin || "") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // For legacy browser support
};
export default corsOptions;
