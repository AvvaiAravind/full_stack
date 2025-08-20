import connectDB from "./config/dbConn.js";
import verifyJWT from "./middleware/verifyJWT.middleware.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import app from "./server.js";

const PORT = process.env.PORT || 3500;

// connect to the database
connectDB();

// public routes (not auth required)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRouter);

// protected routes (auth required)
app.use(verifyJWT);
app.use("/api/users", userRouter);

// start the server (port 3500)
app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
  });

export default app;
