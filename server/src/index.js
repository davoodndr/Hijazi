import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import connectDB from "./common/db.js";
import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRouter.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* const allowedOrigins = [
  process.env.FRONT_END_URL,
  process.env.REMOTE_URL,
];

function (origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
} */

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  credentials: true,
  origin: process.env.FRONT_END_URL
}));
app.use(cookieParser());

/* app.post('/api/auth/register',(req, res) => {
  console.log(req.body)
}) */

app.use('/api/auth',authRouter)
app.use('/api/admin',adminRouter)


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
  })
})