import "dotenv/config";
import express from "express";
import cors from "cors";
import { settings } from "./config/settings";
import { chatRouter } from "./routes/chat";

const app = express();

app.use(cors({ origin: settings.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use("/", chatRouter);

app.listen(settings.PORT, () => {
  console.log(`VORNIQ backend running on port ${settings.PORT}`);
});
