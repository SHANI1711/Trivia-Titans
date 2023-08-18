import {
	ApiGatewayManagementApiClient,
	PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	ScanCommand,
	PutCommand,
	GetCommand,
	DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client1 = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client1);

const tableName = 'multiplechoicequestion1';
const playerOnlineTable = 'playersconected';

export const handler = async (event) => {
	const domain = event.requestContext.domainName;
	const stage = event.requestContext.stage;
	const connectionId = event.requestContext.connectionId;
	const callbackUrl = `https://${domain}/${stage}`;
	const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

	console.log('event2');
	console.log(event);
	let a = event.body;
	console.log(typeof a);
	let b = a.action;
	console.log(b);
	let e = a['action'];
	console.log(e);
	let body;
	let fetchDataFromPlayerConnected = await dynamo.send(
		new ScanCommand({ TableName: playerOnlineTable })
	);

	console.log('fetchDataFromPlayerConnected');
	console.log(fetchDataFromPlayerConnected);
	body = await dynamo.send(new ScanCommand({ TableName: tableName }));
	let itemCount = body.Count;
	body = body.Items;
	// body = JSON.stringify(body);

	const playersOnlinelist = fetchDataFromPlayerConnected.Items;
	console.log('playersOnlinelist');
	console.log(playersOnlinelist);

	function timeout1(ms, body, client) {
		console.log('timeout start1');
		return new Promise(async (resolve) => {
			let i = 0;
			for (const value of body) {
				i++;
				console.log('ïnside value');
				console.log('inside question loop');

				console.log('beforecallingtimeout');
				await timeout(ms, value, client, playersOnlinelist);
				console.log('aftertimeou t');

				if (i >= itemCount) {
					console.log('inside resolve' + i);
					resolve();
				}
			}
		});
	}

	await timeout1(5000, body, client);

	return {
		statusCode: 200,
	};
};

function timeout(ms, value, client, playersOnlinelist) {
	console.log('timeout start');

	return new Promise((resolve) => {
		setTimeout(async () => {
			console.log(`timeout cb fired after ${ms} ms`);
			for (const playerConnectedId of playersOnlinelist) {
				console.log(value);
				console.log('inside connection loop');

				const value1 = [
					value,
					{ connectionId: playerConnectedId.connectionId },
				];

				console.log(value1);

				const requestParams = {
					ConnectionId: playerConnectedId.connectionId,
					Data: JSON.stringify(value1),
				};
				await senddataafter(requestParams, client);
			}
			console.log('after sending data');
			resolve();
		}, ms);
	});
}

async function senddataafter(requestParams, client) {
	console.log('inside sending data');
	const command = new PostToConnectionCommand(requestParams);

	try {
		await client.send(command);
		console.log('tried sending data');
	} catch (error) {
		console.log('got eror sending data');
		console.log(error);
	}
}
