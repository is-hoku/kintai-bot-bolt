import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.KINTAI_API_URL || "http://localhost:8080";
const freeeURL = "https://api.freee.co.jp/hr";

export const AxiosClient: AxiosInstance = axios.create({
	baseURL,
	timeout: 3000,
	headers: {},
});

export const AxiosFreeeClient: AxiosInstance = axios.create({
	baseURL: freeeURL,
	timeout: 3000,
	headers: {},
});
