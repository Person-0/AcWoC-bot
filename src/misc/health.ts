import express from "express";
import { clog } from "./misc.js";
const log = clog("web");

const app = express();

let lastLdPing = Date.now();
app.get("/", (req, res) => {
    res.send("hello world");

    // ping leaderboard every 15minutes
    const now = Date.now();
    if (now - lastLdPing >= 15 * 60e3) {
        lastLdPing = now;
        try {
            fetch(process.env.LEADERBOARD_FETCH_URL as string);
        } catch (e) { }
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    log("web service runing on PORT", PORT);
});