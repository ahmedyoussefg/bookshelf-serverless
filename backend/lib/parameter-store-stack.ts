import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, Model, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import path from 'path';
export class ParameterStoreStack extends cdk.Stack {
  public readonly jwtSecretParam: StringParameter;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define parameter store for jwt secret key
    const jwtSecretParam = new StringParameter(this, "JwtSecretKey", {
      parameterName: "jwt-secret-key-v2",
      stringValue: "secret-key-placeholder", // will change this manually in AWS Console
      tier: ParameterTier.STANDARD,
      description: "JWT Secret Key",
    });
    this.jwtSecretParam=jwtSecretParam;
  }
}
