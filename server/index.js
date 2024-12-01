import express from 'express'
import mongoose from 'mongoose';
import userRouter from "./routes/user_routes.js"
import authRouter from "./routes/auth_route.js"
import listingRouter from "./routes/listing_route.js"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors  from 'cors'

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database is connected");
    
}).catch((err) => {
    console.log(err);
    
})

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin:'http://127.0.0.1:5173',
}))

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/listing", listingRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
