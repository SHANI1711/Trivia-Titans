import  { SNSClient } from "@aws-sdk/client-sns";
import {PublishCommand } from "@aws-sdk/client-sns";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
DynamoDBDocumentClient,
ScanCommand,
PutCommand,
GetCommand,
DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client1 = new DynamoDBClient({});
const playerScoreTable = "playersScore";

  
const dynamo = DynamoDBDocumentClient.from(client1);
export const handler = async (event) => {

        // Set the AWS Region.
    const REGION = "us-east-1"; //e.g. "us-east-1"
    // Create SNS service object.
    const snsClient = new SNSClient({ region: REGION });
  
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    const callbackUrl = `https://${domain}/${stage}`;
    const eventBody = JSON.parse(event.body)
    const teamName = eventBody.message.teamName;
    const quizName =  eventBody.message.quizName;
    console.log("eventsbody",event.body);
    console.log("teamName",teamName);
    console.log("quizName",quizName);
    console.log('callbackUrl',callbackUrl);
    
  const scoreListBody = await dynamo.send(new ScanCommand({
    TableName: playerScoreTable,
    FilterExpression: "#teamName = :teamName AND #quizName = :quizName", // Additional condition using AND
    ExpressionAttributeNames: {
      "#teamName": "teamName",
      "#quizName": "quizName", // Assuming 'score' is the attribute for the score
    },
    ExpressionAttributeValues: {
      ':teamName': teamName,
      ':quizName': quizName, // Replace 100 with the minimum score value you want to use
    }
  }));

  const scoreList = scoreListBody.Items[0];
  console.log("scoreListBo");
  console.log(scoreListBody.Items);
  console.log("scoreList");
  console.log(scoreList)

    
    const payloadToSendDataToClient = `{"data":"quiz1","callbackUrl":"${callbackUrl}","teamName":"${teamName}","quizName":"${quizName}"}`
    const topicArn = 'arn:aws:sns:us-east-1:013229639524:sendQuestionSendRequest'; // Replace this with the ARN of your SNS topic
    const message = payloadToSendDataToClient;
    
    const params = {
      Message: message,
      TopicArn: topicArn,
    };
    
    try {
        const data = await snsClient.send(new PublishCommand(params));
        console.log("Success.",  data);
      } catch (err) {
        console.log("Error", err.stack);
      }
    // const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });
    return{
      statusCode:200,
    };
  };
