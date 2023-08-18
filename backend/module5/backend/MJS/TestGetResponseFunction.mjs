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
  const questionsTable = "questionsData";
  const tableName = "playerAnswers";
  const playerScoreTable = "playersScore";
  let answerStatus = false;
  export const handler = async (event) => {
  
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    let playerNewScore=0;
  
  
    
    console.log("events");
    console.log(event);
  // console.log(event.body.questionNumber)
    const a  = JSON.parse(event.body);
    console.log(a);
      console.log(typeof(a.questionNumber));
      const sameGamePlayedTimes = a.sameGamePlayedTimes;
  const body = await dynamo.send(new ScanCommand({ 
    TableName: questionsTable,
    FilterExpression: "#num = :questionNumber",
    ExpressionAttributeNames: {
      "#num": "number"
    },
    ExpressionAttributeValues: {
      ':questionNumber': a.questionNumber  // Assuming 'number' is a numeric attribute
    }
  }));
  
  const scoreListBody = await dynamo.send(new ScanCommand({ 
    TableName: playerScoreTable,
    FilterExpression: "#playerID = :playerEmail AND #connectionID = :connectionID",
    ExpressionAttributeNames: {
      "#playerID": "playerID",
      "#connectionID":"connectionID"
    },
    ExpressionAttributeValues: {
      ':playerEmail': a.playerEmail,
      ':connectionID':connectionId// Assuming 'number' is a numeric attribute
    }
  }
  
  ))
  const scoreListItems = scoreListBody.Items;
  if(scoreListItems.length !=0){
      const scoreList = scoreListBody.Items[0];
  
      console.log("scoreList");
      console.log(scoreListBody);
      console.log("scoreList");
      console.log(scoreList)
      playerNewScore = scoreList.score;
  }
  
  const answerList = body.Items[0];
    console.log("body");
    console.log(body);
    console.log("answerList.answer");
    console.log(answerList.answer + ""+ typeof(answerList.answer));
      console.log("a.playerAnswer");
    console.log(a.playerAnswer+ ""+ typeof(a.playerAnswer));
    
  if(a.playerAnswer == answerList.answer){
    console.log("answer true");
    answerStatus = true;
    playerNewScore++;
  }
  else{
    console.log("answer false");
    answerStatus = false;
  }
    // let answersData = await dynamo.send(
    //         new ScanCommand({ 
    //         TableName: tableName,
    //         Select:"COUNT"
             
    //         })
    //       );
    // const numberOfAnswers = answersData.Count;
    // const newnumberOfAnswers  = numberOfAnswers+1;
  
  //     await dynamo.send(
  //     new PutCommand({
  //     TableName: tableName,
  //     Item: {
  //       numbers:newnumberOfAnswers,
  //       questionnumber:a.questionNumber,
  //       connectionId:connectionId,
  //       answerStatus:answerStatus,
  //       playerEmail:a.playerEmail,
  //       teamName:a.teamName,
  //       quizName:a.quizName
        
  //     },
  //   })
  // );  
  
    // let scoreData = await dynamo.send(
    //         new ScanCommand({ 
    //         TableName: playerScoreTable,
    //         Select:"COUNT"
             
    //         })
    //       );
          
    // const scoreDataCount = scoreData.Count;
    // const newScoreDataCount  = scoreDataCount+1;
  
  
  await dynamo.send( new PutCommand(
    {
        TableName:playerScoreTable,
        Item:{
          gamePlayedTimes:sameGamePlayedTimes,
    connectionID:connectionId,
    playerID:a.playerEmail,
    score: playerNewScore,
    quizName: a.quizName,
    teamName: a.teamName
  
  
    }
  }
  ));
    console.log("änswerstatus"+ answerStatus)
        return {
      statusCode: 200,
    };
  };