import express from "express";
import routes from "./routes.js";
import cors from "cors";
const app = express()

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(3000, ()=>{
    console.log("running on port 3000")
})