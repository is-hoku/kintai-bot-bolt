import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { AxiosClient, AxiosFreeeClient } from "./axios";
import { auth } from "./cmd/auth";
import { clock_in } from "./cmd/clock_in";
import { clock_out } from "./cmd/clock_out";
import { break_begin } from "./cmd/break_begin";
import { break_end } from "./cmd/break_end";

dotenv.config();

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const PORT = process.env.PORT || "3000";

app.command("/auth", auth);
app.command("/clock_in", clock_in);
app.command("/clock_out", clock_out);
app.command("/break_begin", break_begin);
app.command("/break_end", break_end);

(async () => {
	await app.start(parseInt(PORT));
	console.log("⚡️ Bolt app is running!");
})();
