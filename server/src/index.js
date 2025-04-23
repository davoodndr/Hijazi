import express, { urlencoded } from "express"
import authRouter from "./routes/authRouter.js";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import connectDB from "./common/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;



app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  credentials: true,
  origin: [process.env.FRONT_END_URL]
}));
app.use(cookieParser());

/* app.post('/api/auth/register',(req, res) => {
  console.log(req.body)
}) */

app.use('/api/auth',authRouter)






connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
  })
})