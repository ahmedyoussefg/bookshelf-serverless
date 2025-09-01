import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, Model, RequestValidator, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

interface Props extends cdk.StackProps{
  table: Table,
  api: RestApi,
  createBookModel: Model,
  updateBookModel: Model,
  createBookRequestValidator: RequestValidator,
  updateBookRequestValidator: RequestValidator,
  deleteBookRequestValidator: RequestValidator,
}
export class BookStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const table = props.table;
    const api = props.api;

    const bookIdIndexName = 'PK-bookId-index';

    // define AWS Lambda for get User Books
    const getUserBooks = new NodejsFunction(this, 'getUserBooks', {
        runtime: Runtime.NODEJS_22_X,
        entry: path.join(__dirname, '../lambdas/get-user-books.ts'),
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
      entry: path.join(__dirname, '../lambdas/add-user-book.ts'),
      handler: 'handler',
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });
    table.grantWriteData(addUserBook);

    const updateBook = new NodejsFunction(this, 'UpdateBook', {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../lambdas/update-book.ts'),
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


    const deleteBook = new NodejsFunction(this, 'DeleteBook', {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../lambdas/delete-book.ts'),
      handler: 'handler',
      environment: {
        DB_TABLE_NAME: table.tableName,
        BOOKID_INDEX_NAME: bookIdIndexName,
      }
    });
    deleteBook.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:Query'],
      resources: [`${table.tableArn}/index/${bookIdIndexName}`]
    }))
    table.grantWriteData(deleteBook);

    // define book resources
    const usersResource = api.root.addResource('user'); // api /user    
    const booksResource = usersResource.addResource('books'); // api /user/books

    // add methods to books resource
    booksResource.addMethod('GET', new LambdaIntegration(getUserBooks));
    booksResource.addMethod('POST', new LambdaIntegration(addUserBook), {
      requestModels: {
        "application/json": props.createBookModel
      },
      requestValidator: props.createBookRequestValidator,
    });
    
    const bookWithId = booksResource.addResource('{id}'); // api 
    bookWithId.addMethod('PATCH', new LambdaIntegration(updateBook), {
      requestModels: {
        "application/json": props.updateBookModel
      },
      requestParameters: {
        'method.request.path.id': true
      },
      requestValidator: props.updateBookRequestValidator,
    });

    bookWithId.addMethod('DELETE', new LambdaIntegration(deleteBook), {
      requestValidator: props.deleteBookRequestValidator,
    });
  }
}
