import axios from "axios";
import {apiAnswer} from "./index";
import * as fs from "fs";

function CheckNextLink(nextlink : string) : string {
	let pattern : RegExp = /<([^>]+)>; rel="next"/
	const match : RegExpExecArray | null = pattern.exec(nextlink)
	if (match) {
		const secondLink = match[1]
		return secondLink
	}
	console.log('No match found')
	return('Big error encountered')
}

function printResult(allResponses: any[]) : string {
	if (fs.existsSync('./output.json'))
		fs.writeFileSync('output.json', "")
	for (const response of allResponses) {
		fs.appendFileSync('output.json', JSON.stringify(response, null, 2))
	}
	return ('Success');
}

async function askForFilter(url: string, rl: any) {
	return new Promise<string>((resolve,reject) => {
		console.log('Do you want to add any filter?')
		rl.question('', async (input: string) => {
			if (input.toUpperCase() === 'YES') {
				console.log('Insert your filters. Usage ex: ?filter[id]=value&filter[campus]=anothervalue')
				rl.question('', async (input: string)=> {
					url += input.trim();
					rl.close()
					resolve(url);
				})
			}
			else {
				rl.close()
				resolve(url)
			}
		});
	})
}

export async function getFunction(token : any, url: string, rl: any) {
	let allResponses = []
	url = await askForFilter(url, rl);
	while (true) {
		try {
			console.log('Calls are being made...')
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token.access_token}`,
				}
			});
			if (response.status >= 200 && response.status <= 299) {
				allResponses.push(response.data)
				try {
					const linkHeader = response.headers.link;
					const nextlink = linkHeader?.split(',').find((link: string) => link.includes('rel="next"'));
					if (nextlink != null) {
						url = CheckNextLink(nextlink);
					} else {
						break;
					}
				} catch (error) {
					console.error(error);
				}
			} else {
				console.error('Failed to fetch data. Status code:', response.status);
				break;
			}
		}
		catch (error : any) {
			console.error('Failed to fetch data. Status code:', error.message)
			return;
		}
	}
	if (printResult(allResponses) == 'Success') {
		apiAnswer('get', true);
	}
	else {
		apiAnswer('get', false)
	}
}