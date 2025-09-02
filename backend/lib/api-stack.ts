import * as cdk from "aws-cdk-lib";
import { Model, RequestValidator, Resource, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import buildCreateBookModel from "../models/create-book-model";
import buildUpdateBookModel from "../models/update-book-model";
import buildCreateBookRequestValidator from "../validators/create-book-validator";
import buildUpdateBookRequestValidator from "../validators/update-book-validator";
import buildDeleteBookRequestValidator from "../validators/delete-book-validator";
import buildRegisterUserModel from "../models/register-user-model";
import buildRegisterUserRequestValidator from "../validators/register-user-validator";

export class ApiStack extends cdk.Stack {
  public readonly api: RestApi;
  public readonly createBookModel: Model;
  public readonly updateBookModel: Model;
  public readonly registerUserModel: Model;
  public readonly createBookRequestValidator: RequestValidator;
  public readonly updateBookRequestValidator: RequestValidator;
  public readonly deleteBookRequestValidator: RequestValidator;
  public readonly registerUserRequestValidator: RequestValidator;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // define API gateway
    this.api = new RestApi(this, 'bookshelf-api');
    
    // define API gateway models
    this.createBookModel = buildCreateBookModel(this, this.api);
    this.updateBookModel = buildUpdateBookModel(this, this.api); 
    this.registerUserModel = buildRegisterUserModel(this, this.api);

    // define API request validators
    this.createBookRequestValidator = buildCreateBookRequestValidator(this, this.api);
    this.updateBookRequestValidator = buildUpdateBookRequestValidator(this, this.api);
    this.deleteBookRequestValidator = buildDeleteBookRequestValidator(this, this.api);
    this.registerUserRequestValidator = buildRegisterUserRequestValidator(this, this.api);
  } 
}
