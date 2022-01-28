import { SlackCommandMiddlewareArgs } from "@slack/bolt";
import { AxiosClient } from "../axios";

export const auth = async ({ ack, respond }: SlackCommandMiddlewareArgs) => {
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
};
