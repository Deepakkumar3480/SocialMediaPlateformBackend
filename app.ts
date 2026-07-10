const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")

// import type{ Request,Response } from 'express';
// import userRoute from "./routes/UserRoute";
import type { Request, Response } from "express";
const userRoute = require("./routes/UserRoute.ts");
const postRoute = require("./routes/PostRoute.ts");
const courseRoute = require("./routes/CourseRoute.ts");
const enrollmentRoute = require("./routes/EnrollmentRoute");
const verifyToken = require("./middleware/AuthMiddleware.ts")


dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/users", userRoute);
app.use("/api/course",courseRoute);
app.use("/api",enrollmentRoute)
app.use("/api/post",postRoute)


app.get("/check", (req: Request, res: Response)=>{
    res.status(200).send("Hello check")
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});