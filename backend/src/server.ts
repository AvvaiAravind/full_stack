import cors from "cors";
import express from "express";
import corsOptions from "./config/corsOptions.js";

const app = express();

//cors
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

export default app;
