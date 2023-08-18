import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client1 = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client1);

const tableName = "multiplechoicequestions";

export const handler = async (event) => {

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrl = `https://${domain}/${stage}`;
  const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

  let body;
  

  body = await dynamo.send(new ScanCommand({ TableName: tableName }));
  body = body.Items;
  body = JSON.stringify(body);

  const requestParams = {
    ConnectionId: connectionId,
    Data: body,
  };
    const requestParams1 = {
    ConnectionId: connectionId,
    Data: "kkkk",
  };
async function callmethod(requestParams){
    console.log("it called");
    const command = new PostToConnectionCommand(requestParams);
    try {
      await client.send(command);
    } catch (error) {
      console.log(error);
  }
}
await callmethod(requestParams);
await callmethod(requestParams);
console.log("it called outside");
await timeout(5000,requestParams1,client);

console.log("running outside");
  console.log("requested");
  console.log(connectionId)


  return {
    statusCode: 200,
  };
};


function timeout(ms,requestParams,client) {
  console.log('timeout start');

  return new Promise(resolve => {
    setTimeout(async() => {
      console.log(`timeout cb fired after ${ms} ms`);
      await senddataafter(requestParams,client);
      console.log("after sending data");
      resolve();
    }, ms);
  });
}

async function senddataafter(requestParams,client){
       console.log("inside sending data");
       const command = new PostToConnectionCommand(requestParams);

      try {
      await client.send(command);
      console.log("tried sending data");
    } catch (error) {
       console.log("got eror sending data");
      console.log(error);
  }
}
