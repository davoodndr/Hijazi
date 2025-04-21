import express, { urlencoded } from "express"
import authRouter from "./routes/authRouter.ts";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import connectDB from "./common/db.ts";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;



app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  credentials: true,
  origin: process.env.FRONT_END_URL
}));
app.use(cookieParser());


app.use('/api/auth', authRouter)






connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
  })
})