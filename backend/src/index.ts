import connectDB from "./config/dbConn";
import verifyJWT from "./middleware/verifyJWT.middleware";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";
import app from "./server";

const PORT = process.env.PORT || 3500;

connectDB(); // connect to the database

// public routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRouter);

// protected routes
app.use(verifyJWT);
app.use("/api/users", userRouter);

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
  });

export default app;
