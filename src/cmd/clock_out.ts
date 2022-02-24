import { AxiosClient } from "../axios";

type freeeParam = {
	company_id: number;
	type: string;
	base_date: string;
	datetime: Date;
};
export const clock_out = async ({ command, ack, respond, client }: any) => {
	try {
		await ack();

		const companyID = process.env.COMPANY_ID;

		// ユーザ ID とアイコン URL を取得
		const user = await client.users.profile.get({
			user: command.user_id,
		});
		if (user.profile == undefined || user.profile == null) {
			throw new Error("Could not get user profile");
		}
		const text = command.text || "稼働おわります！";
		const iconURL = user.profile!.image_original;

		// freee API を叩いて勤怠登録
		const freeeID = await AxiosClient.get(`/user/${user.profile.email}`);
		const params: freeeParam = {
			company_id: Number(companyID),
			type: "clock_out",
			base_date: "",
			datetime: new Date(),
			//datetime: new Date("2022-01-19T06:36:03.995Z"),
		};
		const result = await AxiosClient.post(
			`/dakoku/${freeeID.data.freee_id}`,
			params
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
