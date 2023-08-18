import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	ScanCommand,
	PutCommand,
	GetCommand,
	DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = 'playersconected';

export const handler = async (event, context) => {
	let fetchDataFromPlayerConnected = await dynamo.send(
		new ScanCommand({
			TableName: tableName,
			Select: 'COUNT',
		})
	);
	const playersJoinedCount = fetchDataFromPlayerConnected.Count;
	const currentPlayersJoined = playersJoinedCount + 1;

	const connectId = event['requestContext']['connectionId'];
	const domainName = event['requestContext']['domainName'];
	const stageName = event['requestContext']['stage'];
	const qs = event['queryStringParameters'];
	console.log(
		'Connection ID: ',
		connectId,
		'Domain Name: ',
		domainName,
		'Stage Name: ',
		stageName,
		'Query Strings: ',
		qs
	);
	await dynamo.send(
		new PutCommand({
			TableName: tableName,
			Item: {
				id: currentPlayersJoined,
				connectionId: connectId,
			},
		})
	);

	return { statusCode: 200 };
};
