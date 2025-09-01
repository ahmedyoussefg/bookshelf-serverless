import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

interface Props extends cdk.StackProps{
  table: Table,
}
export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const table = props.table;
    const bookIdIndexName = 'PK-bookId-index';

    // define AWS Lambda for get User Books
    const getUserBooks = new NodejsFunction(this, 'getUserBooks', {
        runtime: Runtime.NODEJS_22_X,
        entry: path.join(__dirname, '../lambda/get-user-books.ts'),
        handler: 'handler',
        environment: {
          DB_TABLE_NAME: table.tableName
        }
      }
    );
    table.grantReadData(getUserBooks);

    // define AWS Lambda for add User Book
    const addUserBook = new NodejsFunction(this, 'AddUserBook', {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../lambda/add-user-book.ts'),
      handler: 'handler',
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });
    table.grantWriteData(addUserBook);

    const updateBook = new NodejsFunction(this, 'UpdateBook', {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../lambda/update-book.ts'),
      handler: 'handler',
      environment: {
        DB_TABLE_NAME: table.tableName,
        BOOKID_INDEX_NAME: bookIdIndexName,
      }
    });
    updateBook.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:Query'],
      resources: [`${table.tableArn}/index/${bookIdIndexName}`]
    }))
    table.grantWriteData(updateBook);

    // define API gateway

    const api = new RestApi(this, 'bookshelf-api');

    const user = api.root.addResource('user'); // api /user
    const books = user.addResource('books'); // api /user/books
    books.addMethod('GET', new LambdaIntegration(getUserBooks));
    books.addMethod('POST', new LambdaIntegration(addUserBook));
    
    const bookWithId = books.addResource('{id}');
    bookWithId.addMethod('PATCH', new LambdaIntegration(updateBook));
  }
}
