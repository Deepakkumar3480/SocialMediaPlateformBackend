import express, { Request, Response } from "express";
const cors = require("cors")
const dotenv = require("dotenv")

const userRoute = require("./routes/UserRoute.ts");
const postRoute = require("./routes/PostRoute.ts");
const courseRoute = require("./routes/CourseRoute.ts");
const enrollmentRoute = require("./routes/EnrollmentRoute.ts");
const saveRoute = require("./routes/SavedRoute.ts");
const likeRoute = require("./routes/LikeRoute.ts");
const commentRoute = require("./routes/CommentRoute.ts");

dotenv.config();

const app = express();


// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/users", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/enroll", enrollmentRoute);
app.use("/api/post", postRoute);
app.use("/api/save", saveRoute);
app.use("/api/like", likeRoute);
app.use("/api/comment", commentRoute);


// Health check
app.get("/check", (req: Request, res: Response) => {
  res.status(200).send("Hello check");
});


module.exports=app;