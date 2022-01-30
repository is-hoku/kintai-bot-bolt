import { AxiosClient, AxiosFreeeClient } from "../axios";

type freeeParam = {
	company_id: number;
	type: string;
	base_date: string;
	datetime: Date;
};

export const clock_in = async ({ command, ack, respond, client }: any) => {
	try {
		await ack();

		// AccessToken の Refresh
		const refresh = await AxiosClient.get(`/refresh`);
		if (refresh.status != 200) {
			throw new Error("Failed to refresh access token");
		}

		const companyID = process.env.COMPANY_ID;
		const accessToken = refresh.data.access_token;

		// ユーザ ID とアイコン URL を取得
		const user = await client.users.profile.get({
			user: command.user_id,
		});
		if (user.profile == undefined || user.profile == null) {
			throw new Error("Could not get user profile");
		}
		const text = command.text || "稼働します！";
		const iconURL = user.profile!.image_original;

		// freee API を叩いて勤怠登録
		const freeeID = await AxiosClient.get(`/user/${user.profile.email}`);
		const params: freeeParam = {
			company_id: Number(companyID),
			type: "clock_in",
			base_date: "",
			datetime: new Date(),
		};
		const config = {
			headers: { Authorization: `Bearer ${accessToken}` },
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
			icon_url: iconURL,
		});
	} catch (e: any) {
		await respond({
			text: `error: ${e.message}`,
			response_type: "ephemeral",
		});
	}
};
