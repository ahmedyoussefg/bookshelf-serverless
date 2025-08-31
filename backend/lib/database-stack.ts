import * as cdk from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DatabaseStack extends cdk.Stack {
  public readonly table: Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define DynamoDB Table
    const table = new Table(this, "bookshelf-db", {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING,
      },
    });

    // define Global Secondary indexes
    // GSI to get user from username
    table.addGlobalSecondaryIndex({
      indexName: "username-index",
      partitionKey: {
        name: "username",
        type: AttributeType.STRING,
      },
    });

    // GSI to get books from PK and starred
    table.addGlobalSecondaryIndex({
      indexName: "PK-starred-index",
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "starred",
        type: AttributeType.STRING,
      },
    });

    // GSI to get book from PK (USER#UserID) and bookID
    table.addGlobalSecondaryIndex({
      indexName: "PK-bookId-index",
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "bookId",
        type: AttributeType.STRING,
      },
    });
    this.table = table;
  }
}
