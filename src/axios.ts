import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.KINTAI_API_URL || "http://localhost:8080";

export const AxiosClient: AxiosInstance = axios.create({
	baseURL,
	timeout: 3000,
	headers: {},
});
