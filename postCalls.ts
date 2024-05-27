import axios from "axios";
import {apiAnswer} from "./index";
import * as readline from "readline";

function innerDictionaryValue(key: string, rl: readline.Interface): any {
	return new Promise<any | void>((resolve, reject) => {
		console.log(`Which type of value you need for ${key}? String, Number, Dictionary or Array`)
		rl.question('', async (input: string)=> {
			switch (input.toUpperCase().trim()) {
				case 'NUMBER':
					console.log(`Enter the value of ${key}`)
					rl.question('', async (input: string) => {
						const inputNumber = parseInt(input.trim())
						resolve(inputNumber)
					})
					return;

				case 'STRING':
					console.log(`Enter the value of ${key}`)
					rl.question('', async (input: string) => {
						resolve(input)
					})
					return;

				case 'DICTIONARY':
					let data: any
					data = innerDictionaryKeys(rl)
					resolve(data)
					return data

				case 'ARRAY':
					console.log('Enter all the values you need separated by a comma')
					rl.question('', async (input: string)=> {
						let inputString: any[] = input.split(',').map(elem => elem.trim())
						for (let element of inputString) {
							try {
								element = parseInt(element)
							} catch (e) {
							}
						}
						resolve(inputString)
						return inputString
					})
					break;

				default:
					let data2: any = innerDictionaryValue(key, rl)
					resolve(data2)
					break;
			}
		})

	})
}

function innerDictionaryKeys(rl: readline.Interface): any {
	return new Promise<any>(resolve => {
		let dictionary: {[keys: string]: [value: any]} = {}
		console.log('Insert the most inner elements keys separated by a comma.')
		console.log('Usage example begin_at, end_at, login, ...')
		rl.question('', async (input:string) => {
			let inputSplit = input.split(',')
			let keys: string[] = inputSplit.map(key => key.trim());
			let promises: Promise<any>[] = [];
			for (let key of keys) {
				promises.push(await innerDictionaryValue(key, rl))
			}
			Promise.all(promises)
				.then(results => {
					for (let i= 0; i < keys.length; i++) {
						dictionary[keys[i]] = results[i]
					}
					resolve(dictionary)
				})
		})
	})
}

function postElement(rl: readline.Interface) : any {
	return new Promise<any>(resolve => {
		console.log('Insert the element you need. Usage ex: user')
		rl.question('', async (input: string) => {
			let element: {[key: string]: any} = {}
			element[`${input.trim()}`] = await innerDictionaryKeys(rl)
			resolve(element)
		})
	})
}

export function postNoElement(rl: readline.Interface) : any {
	return new Promise<any>(resolve => {
		resolve(innerDictionaryKeys(rl))
	})
}

export async function dataConstruction(rl: any) {
	return new Promise<any>(resolve => {
		console.log('Do you need an outer element?')
		rl.question('', async (input: string)=> {
			if (input.toUpperCase().trim() === 'YES') {
				let data = await postElement(rl)
				resolve(data)
				return data
			}
			else {
				let data = await postNoElement(rl)
				resolve(data)
				return data
			}
		})
	})
}

export async function postFunction(token : any, url: string, rl: any) {
	if (!token || !token.access_token) {
		console.error('Access token is missing or invalid.');
		return;
	}
	let data: any
	data = await dataConstruction(rl)
	console.log(data)
	try {
		const response = await axios.post(
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
			apiAnswer('post', true)
		else
			apiAnswer('post', false)
	} catch (error : any) {
		console.error('Error posting data:', error.message);
	}
}