import axios from "axios";
import {apiAnswer} from "./index";
import * as readline from "readline";
import {dataConstruction} from "./postCalls";

export async function putFunction(token: any, url: string, rl: readline.Interface) {
	if (!token || !token.access_token) {
		console.error('Access token is missing or invalid.');
		return;
	}
	let data: any
	data = await dataConstruction(rl)

	try {
		const response = await axios.put(
			url,
			data,
			{
				headers: {
					Authorization: `Bearer ${token.access_token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		if (response.status >= 200 && response.status <= 299)
			apiAnswer('put', true)
		else
			apiAnswer('put', false)
	} catch (error : any) {
		console.error('Error posting data:', error.message);
	}
}