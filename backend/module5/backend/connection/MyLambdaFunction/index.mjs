import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "playersconnected";

 export const handler = async(event, context) => {
  
  let fetchDataFromPlayerConnected = await dynamo.send(
          new ScanCommand({ 
           TableName: tableName,
           Select:"COUNT"
           
          })
        );
  const playersJoinedCount = fetchDataFromPlayerConnected.Count;
  const currentPlayersJoined  = playersJoinedCount+1;
  const playerEmail = event['queryStringParameters']["playerEmail"];

  
  console.log("context",event);
  console.log("event",playerEmail);
  
  const connectId = event["requestContext"]["connectionId"]
    const domainName = event["requestContext"]["domainName"]
    const stageName = event["requestContext"]["stage"]
    const qs = event['queryStringParameters']
    console.log('Connection ID: ', connectId, 'Domain Name: ', domainName, 'Stage Name: ', stageName, 'Query Strings: ', qs )
    await dynamo.send(
    new PutCommand({
    TableName: tableName,
    Item: {
      id: currentPlayersJoined,
      connectionId:connectId,
      playerEmail:playerEmail
    },
  })
);
        
        // // body = body.Items;
        // console.log("bodyitem"+JSON.stringify(body));
        // console.log("bodyitem"+body.Count);

    return {"statusCode" : 200}
};
