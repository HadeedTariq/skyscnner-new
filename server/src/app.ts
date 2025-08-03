import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as middlewares from "./middlewares";
import MessageResponse from "./interfaces/MessageResponse";
import { connectToDb } from "./connection/dbConnection";
import { userRouter } from "./routes/user/user.routes";

import { config } from "dotenv";
import { bookingRouter } from "./routes/bookings/booking.routes";
import { dashboardRouter } from "./routes/dashboard/dashboard.routes";

config();

const app = express();
const port = process.env.PORT || 3001;
app.use(
  cors({
    origin: [process.env.FRONT_END_ORIGIN!],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

connectToDb(process.env.MONGO_URI!);
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome to sky scanner backend",
  });
});
app.use("/api/auth", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/dashboard", dashboardRouter);
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
