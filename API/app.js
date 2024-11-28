import express from "express";
import env from "dotenv";
import home from "./routes/garbagebins.js"
import bodyParser from "body-parser";
import cors from 'cors'
env.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

app.use("/", home);


app.use((req, res) => {
    res.status(404).json({ error: "404 not found" });;
});


app.listen(port);