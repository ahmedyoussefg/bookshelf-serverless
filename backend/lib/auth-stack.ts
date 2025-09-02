import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, Model, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ParameterTier, ParameterType, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import path from 'path';

interface Props extends cdk.StackProps{
  table: Table,
  api: RestApi,
  authModel: Model,
  authRequestValidator: RequestValidator,
}
export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const table = props.table;
    const api = props.api;
    const usernameIndexName = 'username-index';
    // define parameter store for jwt secret key
    const jwtSecretParam = new StringParameter(this, "JwtSecretKey", {
      parameterName: "jwt-secret-key",
      stringValue: "secret-key-placeholder", // will change this manually in AWS Console
      tier: ParameterTier.STANDARD,
      description: "JWT Secret Key",
    });
    
    // define AWS Lambda for user register
    const registerUser = new NodejsFunction(this, 'RegisterUser', {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../lambdas/auth/register-user.ts'),
      handler: 'handler',
      environment: {
          DB_TABLE_NAME: table.tableName,
          USERNAME_INDEX_NAME: usernameIndexName,
          JWT_SECRET_KEY_PARAM_NAME: jwtSecretParam.parameterName,
      },
      timeout: cdk.Duration.seconds(8),
    });
  
    table.grantWriteData(registerUser);
    jwtSecretParam.grantRead(registerUser);
    registerUser.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:Query'],
      resources: [`${table.tableArn}/index/${usernameIndexName}`]
    }));
    
    const authResource = api.root.addResource('auth');
    const authRegisterResource = authResource.addResource('register');
    authRegisterResource.addMethod('POST', new LambdaIntegration(registerUser), {
      requestModels: {
        "application/json": props.authModel,
      },
      requestValidator: props.authRequestValidator,
    });
    
        
    // define AWS Lambda for user login
    const loginUser = new NodejsFunction(this, 'LoginUser', {
        runtime: Runtime.NODEJS_22_X,
        entry: path.join(__dirname, '../lambdas/auth/login-user.ts'),
        handler: 'handler',
        environment: {
            DB_TABLE_NAME: table.tableName,
            USERNAME_INDEX_NAME: usernameIndexName,
            JWT_SECRET_KEY_PARAM_NAME: jwtSecretParam.parameterName,
        },
        timeout: cdk.Duration.seconds(8),
    });
  
    jwtSecretParam.grantRead(loginUser);
    loginUser.addToRolePolicy(new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [`${table.tableArn}/index/${usernameIndexName}`]
    }));
    
    const authLoginResource = authResource.addResource('login');
    authLoginResource.addMethod('POST', new LambdaIntegration(loginUser), {
        requestModels: {
            "application/json": props.authModel,
        },
        requestValidator: props.authRequestValidator,
    });
  }
}
