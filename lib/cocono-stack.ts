import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/cdk";
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as lambda from "@aws-cdk/aws-lambda";
import * as sns from "@aws-cdk/aws-sns";

export class CoconoStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // Lambda Backends
    const main = new lambda.Function(this, `Main`, {
      code: lambda.Code.asset("./dist/main"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 60,
      runtime: lambda.Runtime.NodeJS810
    });

    const docs = new lambda.Function(this, `Docs`, {
      code: lambda.Code.asset("./dist/docs"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 10,
      runtime: lambda.Runtime.NodeJS810
    });

    // API Gateway
    const gateway = new apigateway.LambdaRestApi(this, 'CoconoApi', {
      handler: main,
      options: {
        deployOptions: {
          stageName: "v1"
        }
      },
      proxy: false
    });
    gateway.root.addMethod("POST");
    gateway.root.addMethod("GET", new apigateway.LambdaIntegration(docs, { proxy: false }));

    // Send Alarm to Discord
    const notify = new lambda.Function(this, `Notify`, {
      code: lambda.Code.asset("./dist/notify"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 60,
      runtime: lambda.Runtime.NodeJS810,
      environment: {
        DISCORD_NOTIFICATION_URL: process.env.DISCORD_NOTIFICATION_URL
      }
    });

    // Create a SNS topic
    const topic = new sns.Topic(this, `Topic`);
    topic.subscribeLambda(notify);

    // CloudWatch Alarm for Lambda
    const alarm = new cloudwatch.Alarm(this, `ErrorAlarm`, {
      alarmName: "Cocono API Errors",
      alarmDescription: "Cocono Lambda Function Unhandled Errors",
      comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanOrEqualToThreshold,
      evaluationPeriods: 1,
      metric: main.metricErrors(),
      threshold: 1,
    });
    alarm.onAlarm(topic);
    alarm.onOk(topic);
  }
}
