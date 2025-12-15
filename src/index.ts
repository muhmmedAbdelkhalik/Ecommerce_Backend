import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routers/userRoute.js";

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.use('/api/user', userRoute);

app.listen(port, () => {
  console.log(`Express server is running on port: http://localhost:${port}`);
});