import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface Props extends cdk.StackProps{
  table: Table,
  api: RestApi,
}
export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const table = props.table;
    const api = props.api;
    // TODO: auth stack
  }
}
