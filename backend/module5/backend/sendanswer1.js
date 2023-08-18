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
const questionsTable = 'multiplechoicequestion1';
const tableName = 'playeranswer1';
let answerStatus = false;
export const handler = async (event) => {
	const domain = event.requestContext.domainName;
	const stage = event.requestContext.stage;
	const connectionId = event.requestContext.connectionId;
	const callbackUrl = `https://${domain}/${stage}`;
	const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

	console.log('events');
	console.log(event);
	// console.log(event.body.questionNumber)
	const a = JSON.parse(event.body);
	console.log(a);
	console.log(typeof a.questionNumber);
	const body = await dynamo.send(
		new ScanCommand({
			TableName: questionsTable,
			FilterExpression: '#num = :questionNumber',
			ExpressionAttributeNames: {
				'#num': 'number',
			},
			ExpressionAttributeValues: {
				':questionNumber': a.questionNumber, // Assuming 'number' is a numeric attribute
			},
		})
	);

	const answerList = body.Items[0];
	console.log('body');
	console.log(body);
	console.log('answerList.answer');
	console.log(answerList.answer + '' + typeof answerList.answer);
	console.log('a.playerAnswer');
	console.log(a.playerAnswer + '' + typeof a.playerAnswer);

	if (a.playerAnswer == answerList.answer) {
		console.log('answer true');
		answerStatus = true;
	} else {
		console.log('answer false');
		answerStatus = false;
	}

	await dynamo.send(
		new PutCommand({
			TableName: tableName,
			Item: {
				questionnumber: a.questionNumber,
				connectionId: connectionId,
				answerStatus: answerStatus,
			},
		})
	);

	return {
		statusCode: 200,
	};
};
