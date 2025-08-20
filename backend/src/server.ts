/**
 * Express app configuration - middleware setup
 */

import cors from "cors";
import express from "express";
import corsOptions from "./config/corsOptions.js";

const app = express();

// CORS configuration for cross-origin requests
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

export default app;
