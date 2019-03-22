import * as path from "path";

import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/cdk";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as sns from "@aws-cdk/aws-sns";

export class CoconoStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // Lambda Backend
    const main = new lambda.Function(this, `Main`, {
      code: lambda.Code.asset("./dist/main"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 60,
      runtime: lambda.Runtime.NodeJS810,
      environment: {
        CLOUDFRONT_ALIAS_NAME: process.env.CLOUDFRONT_ALIAS_NAME
      }
    });

    // API Gateway
    const gateway = new apigateway.LambdaRestApi(this, "CoconoApi", {
      handler: main,
      options: {
        deployOptions: {
          stageName: "v1"
        }
      },
      proxy: false
    });
    gateway.root.addMethod("POST");
    gateway.root.addMethod("GET");

    // S3 Bucket for Documents
    const bucket = new s3.Bucket(this, `Bucket`, {
      bucketName: process.env.BUCKET_NAME as string,
      websiteIndexDocument: "index.html"
    });

    // S3 Deployment
    new s3Deployment.BucketDeployment(this, `BucketDeployment`, {
      source: s3Deployment.Source.asset(path.resolve("./", "objects")),
      destinationBucket: bucket
    });

    // CloudFront Origin Access Identity
    const oai = new cloudfront.CfnCloudFrontOriginAccessIdentity(this, `S3OriginAccessIdentity`, {
      cloudFrontOriginAccessIdentityConfig: {
        comment: `access-identity-${process.env.BUCKET_NAME}.s3.amazonaws.com`
      }
    });

    // Attach to S3 Bucket
    const permission = new iam.PolicyStatement(iam.PolicyStatementEffect.Allow);
    permission.addPrincipal(new iam.ArnPrincipal(`arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${oai.cloudFrontOriginAccessIdentityId}`));
    permission.addAction("s3:GetObject");
    permission.addResource(`arn:aws:s3:::${process.env.BUCKET_NAME}/*`);
    bucket.addToResourcePolicy(permission);

    // CloudFront
    new cloudfront.CloudFrontWebDistribution(this, `Distribution`, {
      aliasConfiguration: {
        acmCertRef: process.env.ACM_CERTIFICATE_ARN as string,
        names: [process.env.CLOUDFRONT_ALIAS_NAME as string],
        sslMethod: cloudfront.SSLMethod.SNI,
        securityPolicy: cloudfront.SecurityPolicyProtocol.TLSv1_2_2018
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai
          },
          // prettier-ignore
          behaviors: [{
            pathPattern: "/docs/*"
          }]
        },
        {
          customOriginSource: {
            domainName: gateway.url.substring("https://".length, gateway.url.indexOf("/", "https://".length))
          },
          // prettier-ignore
          behaviors: [{
            isDefaultBehavior: true,
            pathPattern: "/",
            defaultTtlSeconds: 1,
            minTtlSeconds: 1,
            maxTtlSeconds: 1,
            allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL
          }],
          originPath: "/v1"
        }
      ],
      priceClass: cloudfront.PriceClass.PriceClass200,
      defaultRootObject: "/"
    });

    // TODO: Add Lambda@Edge Function to /docs behavior for rewriting path from / to /index.html

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
      threshold: 1
    });
    alarm.onAlarm(topic);
    alarm.onOk(topic);
  }
}
