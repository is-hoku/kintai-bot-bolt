import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { AxiosClient, AxiosFreeeClient } from "./axios";

dotenv.config();

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const PORT = process.env.PORT || "3000";

type freeeParam = {
	company_id: number;
	type: string;
	base_date: string;
	datetime: Date;
};

app.command("/auth", async ({ command, ack, respond, client }) => {
	try {
		await ack();

		const auth_url = await AxiosClient.get(`/auth`);
		const res_url = auth_url.data.url || "Access Token is already set.";
		await respond({
			text: `認可URLにアクセスしてください。\n${res_url}`,
			response_type: "ephemeral",
		});
	} catch (e: any) {
		await respond({
			text: `error: ${e.message}`,
			response_type: "ephemeral",
		});
	}
});

app.command("/clock_in", async ({ command, ack, respond, client }) => {
	try {
		await ack();

		// AccessToken のチェック
		const companyID = process.env.COMPANY_ID || "0000000";
		const token = await AxiosClient.get(`/token/${companyID}`);
		if (
			token.data.access_token == "" ||
			token.data.access_token == undefined
		) {
			throw new Error("Not Found Access Token");
		}
		console.log(`${companyID}`);

		// ユーザ ID とアイコン URL を取得
		const user = await client.users.profile.get({
			user: command.user_id,
		});
		if (user.profile == undefined || user.profile == null) {
			throw new Error("Could not get user profile");
		}
		const text = command.text || "稼働します！";
		const icon_url = user.profile!.image_original;
		console.log(`${user.profile}`);

		// freee API を叩いて勤怠登録
		const freeeID = await AxiosClient.get(`/user/${user.profile.email}`);
		const params: freeeParam = {
			company_id: Number(companyID),
			type: "clock_in",
			base_date: "",
			datetime: new Date(),
		};
		console.log(params);
		const config = {
			headers: { Authorization: `Bearer ${token.data.access_token}` },
		};
		console.log(config);
		console.log(freeeID.data.freee_id);
		const result = await AxiosFreeeClient.post(
			`/api/v1/employees/${freeeID.data.freee_id}/time_clocks`,
			params,
			config
		);
		console.log(result);
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
