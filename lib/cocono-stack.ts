import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/cdk";
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as lambda from "@aws-cdk/aws-lambda";
import * as sns from "@aws-cdk/aws-sns";

export class CoconoStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // Lambda Backend
    const backend = new lambda.Function(this, `${name}Backend`, {
      code: lambda.Code.asset("./dist/app"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 60,
      runtime: lambda.Runtime.NodeJS810,
    });

    // API Gateway
    const restApi = new apigateway.LambdaRestApi(this, `${name}Api`, {
      handler: backend,
      proxy: false,
      options: {
        deployOptions: {
          stageName: "v1",
        }
      }
    });
    restApi.root.addMethod("POST");

    // Send Alarm to Discord
    const notify = new lambda.Function(this, `${name}Notify`, {
      code: lambda.Code.asset("./dist/srv"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 60,
      runtime: lambda.Runtime.NodeJS810
    });

    // Create a SNS topic
    const topic = new sns.Topic(this, `${name}Topic`);
    topic.subscribeLambda(notify);

    // CloudWatch Alarm for Lambda
    const alarm = new cloudwatch.Alarm(this, `${name}ErrorAlarm`, {
      alarmName: "Cocono API Errors",
      alarmDescription: "Cocono Lambda Function Unhandled Errors",
      comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanOrEqualToThreshold,
      evaluationPeriods: 1,
      metric: backend.metricErrors(),
      threshold: 1,
    });
    alarm.onAlarm(topic);
    alarm.onOk(topic);
  }
}
