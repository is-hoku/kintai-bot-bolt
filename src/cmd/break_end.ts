import { App, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { AxiosClient, AxiosFreeeClient } from "../axios";

type freeeParam = {
	company_id: number;
	type: string;
	base_date: string;
	datetime: Date;
};
export const break_end = async ({ command, ack, respond, client }: any) => {
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

		// ユーザ ID とアイコン URL を取得
		const user = await client.users.profile.get({
			user: command.user_id,
		});
		if (user.profile == undefined || user.profile == null) {
			throw new Error("Could not get user profile");
		}
		const text = command.text || "再開します！";
		const icon_url = user.profile!.image_original;

		// freee API を叩いて勤怠登録
		const freeeID = await AxiosClient.get(`/user/${user.profile.email}`);
		const params: freeeParam = {
			company_id: Number(companyID),
			type: "break_end",
			base_date: "",
			datetime: new Date(),
			//datetime: new Date("2022-01-19T06:36:03.995Z"),
		};
		const config = {
			headers: { Authorization: `Bearer ${token.data.access_token}` },
		};
		const result = await AxiosFreeeClient.post(
			`/api/v1/employees/${freeeID.data.freee_id}/time_clocks`,
			params,
			config
		);
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
};
