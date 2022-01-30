import { SlackCommandMiddlewareArgs } from "@slack/bolt";
import { AxiosClient } from "../axios";

export const auth = async ({ ack, respond }: SlackCommandMiddlewareArgs) => {
	try {
		await ack();

		const authURL = await AxiosClient.get(`/auth`);
		const resURL = authURL.data.url || "Access Token is already set.";
		await respond({
			text: `認可URLにアクセスしてください。\n${resURL}`,
			response_type: "ephemeral",
		});
	} catch (e: any) {
		await respond({
			text: `error: ${e.message}`,
			response_type: "ephemeral",
		});
	}
};
