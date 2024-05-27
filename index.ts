import {getToken} from "./tokenCreation";
import {getFunction} from "./getCalls";
import {postFunction} from "./postCalls";
import {deleteFunction} from "./deleteCalls";
import {patchFunction} from "./patchClass";
import {putFunction} from "./putClass";
import * as readline from 'readline';

export function apiAnswer(callType: string, success: boolean) {
    if (success) {
        console.log(`${callType.toUpperCase()} call ended successfully.`)
    }
    else {
        console.log(`There was a problem with your ${callType} call.`)
    }
}

async function main() {
    let token = await getToken();
    const rl = readline.createInterface({
        input: process.stdin,
    });
    console.log('Enter the call you want to perform. GET, POST, DELETE, PUT or PATCH:')
    rl.question('', async (input: string) => {
        if (input.toUpperCase().trim() != 'GET'
            && input.toUpperCase().trim() != 'POST'
                && input.toUpperCase().trim() != 'DELETE'
                    && input.toUpperCase().trim() != 'PUT'
                        && input.toUpperCase().trim() != 'PATCH') {
            console.log('Input invalid. Please enter GET, POST, DELETE, PUT or PATCH.')
            rl.close()
            await main();
            return;
        }
        console.log('Enter the endpoint.')
        rl.question('', async (endpoint: string)=> {
            let url: string = 'https://api.intra.42.fr' + `${endpoint}`
            switch (input.toUpperCase().trim()) {
                case 'GET':
                    await getFunction(token, url, rl);
                    break;

                case 'POST':
                    await postFunction(token, url, rl);
                    break;

                case 'DELETE':
                    await deleteFunction(token, url, rl);
                    break;

                case 'PUT':
                    await putFunction(token, url, rl)
                    break;

                case 'PATCH':
                    await patchFunction(token, url, rl)
                    break;
            }
            rl.close();
        })
    });
}

main();
