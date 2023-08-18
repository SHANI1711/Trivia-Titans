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
   console.log("event",event);
  
    const body = await dynamo.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: "#connectionId = :connectionIdValue", // Additional condition using AND
    ExpressionAttributeNames: {
      "#connectionId": "connectionId"
    },
    ExpressionAttributeValues: {
      ':connectionIdValue': event.requestContext.connectionId,
    }
  }));
  let deleteId = body.Items[0].id;
  
   const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      id: deleteId,
    },
  });

  const response = await dynamo.send(command);
console.log("playersJoinedCount",body);
  
        // // body = body.Items;
        // console.log("bodyitem"+JSON.stringify(body));
        // console.log("bodyitem"+body.Count);

    return {"statusCode" : 200}
};
