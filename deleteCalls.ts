import axios from "axios";
import {apiAnswer} from "./index";

async function deleteQuestion(rl: any) {
	return new Promise<any>(resolve => {
		console.log('Do you need any parameter?')
		rl.question('', async (input: string) =>{
			if (input.toUpperCase().trim() === 'YES' || input.toUpperCase().trim() === 'NO')
				resolve(input.toUpperCase().trim())
			else {
				resolve(await deleteQuestion(rl))
			}
		})
	})
}

async function parametersQuestion(rl: any) {
	return new Promise<any>(resolve => {
		console.log('Insert all parameters you want to add separated by a comma')
		rl.question('', async(input: string)=> {
			let parameters = input.split(',').map(param => param.trim())
			resolve(parameters)
		})
	})
}

function singleValueQuestion(key: string, rl: any) {
	return new Promise<any>(resolve => {
		console.log(`Insert the value of ${key}`)
		rl.question('', async (input: string)=> {
			resolve(input.trim())
		})
	})
}

async function valuesQuestion(parametersKeys: any, rl: any) {
	return new Promise<any>(async resolve => {
		let values: any[] = []
		for (let key of parametersKeys) {
			key = key.trim()
			let value = await singleValueQuestion(key, rl)
			values.push(value)
		}
		resolve(values)
	})
}

export async function deleteFunction(token : any, url: string, rl: any) {
	if (!token || !token.access_token) {
		console.error('Access token is missing or invalid.');
		return;
	}
	let answer = await deleteQuestion(rl)
	if (answer === 'YES') {
		let parametersKeys = await parametersQuestion(rl)
		let parametersValues = await valuesQuestion(parametersKeys, rl)
		for (let i = 0; i < parametersKeys.length; i++) {
			if (i === 0) {
				url += '?'
			}
			else {
				url += '&'
			}
			url += `${parametersKeys[i]}=${parametersValues[i]}`
		}
	}
	try {
		const response = await axios.delete(
			url,
			{
				headers: {
					Authorization: `Bearer ${token.access_token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		if (response.status >= 200 && response.status <= 299)
			apiAnswer('delete', true)
		else
			apiAnswer('delete', false)
	} catch (error : any) {
		console.error('Error posting data:', error.message);
		//console.log(error);
	}
}