// import cdk = require('@aws-cdk/cdk');
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/cdk";
import * as lambda from "@aws-cdk/aws-lambda";


export class CoconoStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    // The code that defines your stack goes here
    const backend = new lambda.Function(this, `${name}Backend`, {
      code: lambda.Code.asset("./lib/lambda"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 60,
      runtime: lambda.Runtime.NodeJS810,
    });

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
  }
}
