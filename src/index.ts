import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { AxiosClient } from "./axios";

dotenv.config();

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const PORT = process.env.PORT || "3000";

app.command("/clock_in", async ({ command, ack, respond, client }) => {
	try {
		await ack();

		const user = await client.users.profile.get({
			user: command.user_id,
		});
		if (user.profile == undefined || user.profile == null) {
			throw new Error("Could not get user profile");
		}
		const text = command.text || "稼働します！";
		const icon_url = user.profile!.image_original;

		const freeeID = await AxiosClient.get(`/user/${user.profile.email}`);
		console.log(freeeID);
		await client.chat.postMessage({
			channel: command.channel_id,
			text: text,
			username: `${command.user_name}`,
			icon_url: icon_url,
		});
	} catch (e: any) {
		await respond({
			text: `error: ${e.message}`,
			response_type: "ephemeral",
		});
	}
});

(async () => {
	await app.start(parseInt(PORT));
	console.log("⚡️ Bolt app is running!");
})();
