import { App } from "@slack/bolt";
import dotenv from "dotenv";

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

dotenv.config();
const PORT = process.env.PORT || "3000";

(async () => {
	await app.start(parseInt(PORT));

	console.log("⚡️ Bolt app is running!");
})();
