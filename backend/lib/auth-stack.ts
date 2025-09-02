import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, Model, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

interface Props extends cdk.StackProps{
  table: Table,
  api: RestApi,
  registerUserModel: Model,
  registerUserRequestValidator: RequestValidator,
}
export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const table = props.table;
    const api = props.api;
    const usernameIndexName = 'username-index';
    // define AWS Lambda for user register
    const registerUser = new NodejsFunction(this, 'RegisterUser', {
        runtime: Runtime.NODEJS_22_X,
        entry: path.join(__dirname, '../lambdas/auth/register-user.ts'),
        handler: 'handler',
        environment: {
            DB_TABLE_NAME: table.tableName,
            USERNAME_INDEX_NAME: usernameIndexName
        }
    });
    table.grantWriteData(registerUser);
    registerUser.addToRolePolicy(new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [`${table.tableArn}/index/${usernameIndexName}`]
    }));
    
    const authResource = api.root.addResource('auth');
    const authRegisterResource = authResource.addResource('register');
    authRegisterResource.addMethod('POST', new LambdaIntegration(registerUser), {
        requestModels: {
            "application/json": props.registerUserModel,
        },
        requestValidator: props.registerUserRequestValidator,
    })
  }
}
