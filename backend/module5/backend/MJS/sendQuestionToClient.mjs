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
  const playerScoreTable = "playersScore";

  
  const dynamo = DynamoDBDocumentClient.from(client1);
  
  const tableName = "questionsData";
  const playerOnlineTable = "playersconnected";
  
  export const handler = async (event) => {
    let gamePlayedTimes = 0;
    console.log("event",event);
    console.log("event",event['Records'][0]['Sns']['Message']);
    const jsonString = event['Records'][0]['Sns']['Message'];

    const dataFromGetSendDataRequestFromClient = JSON.parse(jsonString);
    console.log("json",dataFromGetSendDataRequestFromClient);
    console.log("kova",dataFromGetSendDataRequestFromClient.data);
   
    const callbackUrl = dataFromGetSendDataRequestFromClient.callbackUrl;
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

    let body;
    let fetchDataFromPlayerConnected = await dynamo.send(
            new ScanCommand({TableName: playerOnlineTable})
          );
          
const playerEmailArray = fetchDataFromPlayerConnected.Items.map((item) => item.playerEmail);
console.log("playerEmailArray");

console.log(playerEmailArray);
    
    console.log("fetchDataFromPlayerConnected");
    console.log(fetchDataFromPlayerConnected);
    body = await dynamo.send(new ScanCommand({ TableName: tableName }));
    let itemCount = body.Count;
    body = body.Items;
    let quizTime = body[0].quizTime
    
    console.log("body");
    console.log(body);
    console.log("count");
    console.log(itemCount);
    
    const playersOnlinelist = fetchDataFromPlayerConnected.Items;
    console.log("playersOnlinelist");
    console.log(playersOnlinelist);
    
    const scoreListBody = await dynamo.send(new ScanCommand({
    TableName: playerScoreTable,
    FilterExpression: "#teamName = :teamName AND #quizName = :quizName", // Additional condition using AND
    ExpressionAttributeNames: {
      "#teamName": "teamName",
      "#quizName": "quizName", // Assuming 'score' is the attribute for the score
    },
    ExpressionAttributeValues: {
      ':teamName': dataFromGetSendDataRequestFromClient.teamName,
      ':quizName':dataFromGetSendDataRequestFromClient.quizName, // Replace 100 with the minimum score value you want to use
    }
  }));
try{
  const scoreList = scoreListBody.Items[0];
  console.log("kovascoreListBody");
  console.log(scoreListBody.Items);
  console.log("kovascoreList");
  scoreListBody.Items.forEach((item) => {
    console.log("items",item);
  if (item.gamePlayedTimes > gamePlayedTimes) {
    gamePlayedTimes = item.gamePlayedTimes;
  }
 
});
gamePlayedTimes++
   console.log(gamePlayedTimes)
}catch(err){
  
  console.log("error in score getting the data",err);
}

    

  
  function sendEveryQuestion(ms,body,client) {
    console.log('timeout start1');
    return new Promise(async resolve => {
      let i=0;
      for(const value of body){
        i++;
        console.log("ïnside value");
        console.log("inside question loop");


    console.log("beforecallingtimeout");
    await timeout(ms,value,client,playersOnlinelist,dataFromGetSendDataRequestFromClient,gamePlayedTimes,playerEmailArray)
    console.log("aftertimeou t");
     
     
  

  
        if(i>=itemCount){
          console.log("inside resolve"+i);
        resolve();
        }
      }
    });
  }
  
  await sendEveryQuestion(10000,body,client);
  console.log("cametoend");
      return {
      statusCode: 200,
    };
  };
  
  
  
  function timeout(ms,value,client,playersOnlinelist,dataFromGetSendDataRequestFromClient,gamePlayedTimes,playerEmailArray) {
    console.log('timeout start');
  
    return new Promise(resolve => {
      setTimeout(async() => {
        let playerScoreJson=[];
        console.log(`timeout cb fired after ${ms} ms`);
        
        try{
          const scoreListBody = await dynamo.send(new ScanCommand({
            TableName: playerScoreTable,
            FilterExpression: "#teamName = :teamName AND #quizName = :quizName AND #gamePlayedTimes = :gamePlayedTimes"  , // Additional condition using AND
            ExpressionAttributeNames: {
              "#teamName": "teamName",
              "#quizName": "quizName",
              "#gamePlayedTimes":"gamePlayedTimes"// Assuming 'score' is the attribute for the score
            },
            ExpressionAttributeValues: {
              ':teamName': dataFromGetSendDataRequestFromClient.teamName,
              ':quizName': dataFromGetSendDataRequestFromClient.quizName, // Replace 100 with the minimum score value you want to use
              ':gamePlayedTimes':gamePlayedTimes,
            }
          }));

          const scoreList = scoreListBody.Items;
          console.log("scoreListBody");
          console.log(scoreListBody.Items);
          console.log("scoreList");
          console.log(scoreList)
          
          scoreListBody.Items.forEach((item) => {
            let scoreDetials = [item.playerID,item.score];
            playerScoreJson=[...playerScoreJson,scoreDetials];
            console.log("sathis",playerScoreJson);

          });
          console.log(value);
          console.log("inside connection loop");
}
catch(err){
  playerScoreJson=["Nobody in your team scored yet"];
  console.log("error getting the score inside seding data",err);
}
        for(const playerConnectedId of playersOnlinelist){


          const value1 = [value,{"connectionId":playerConnectedId.connectionId,"gamePlayedTimes":gamePlayedTimes,"playerScoreList":playerScoreJson,"playersOnline":playerEmailArray}];
              
          console.log(value1);
          
          const requestParams = {
                                ConnectionId: playerConnectedId.connectionId,
                                Data: JSON.stringify(value1),
                                 };
        await senddataafter(requestParams,client);
        }
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
  