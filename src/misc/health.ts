import express from "express";
import { clog } from "./misc.js";
const log = clog("web");

const app = express();

app.get("/", (req, res) => {
    res.send("hello world");
    try {
        fetch(process.env.LEADERBOARD_FETCH_URL as string);
    } catch (e) {}
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    log("web service runing on PORT", PORT);
});