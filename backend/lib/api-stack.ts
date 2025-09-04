import * as cdk from "aws-cdk-lib";
import { Cors, GatewayResponse, Model, RequestValidator, Resource, ResponseType, RestApi, TokenAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import buildCreateBookModel from "../models/create-book-model";
import buildUpdateBookModel from "../models/update-book-model";
import buildCreateBookRequestValidator from "../validators/create-book-validator";
import buildUpdateBookRequestValidator from "../validators/update-book-validator";
import buildDeleteBookRequestValidator from "../validators/delete-book-validator";
import buildAuthModel from "../models/auth-model";
import buildAuthRequestValidator from "../validators/auth-validator";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { StringParameter, ParameterTier } from "aws-cdk-lib/aws-ssm";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path from "path";
import { CORS_HEADERS } from "../constants/cors-constants";

interface Props extends cdk.StackProps{
  jwtSecretParam: StringParameter,
}
export class ApiStack extends cdk.Stack {
  public readonly api: RestApi;
  public readonly createBookModel: Model;
  public readonly updateBookModel: Model;
  public readonly authModel: Model;
  public readonly createBookRequestValidator: RequestValidator;
  public readonly updateBookRequestValidator: RequestValidator;
  public readonly deleteBookRequestValidator: RequestValidator;
  public readonly authRequestValidator: RequestValidator;
  public readonly authorizer: TokenAuthorizer;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    // define API gateway
    this.api = new RestApi(this, 'bookshelf-api', {
      defaultCorsPreflightOptions: {
        allowOrigins: ["https://bookshelf-serverless.vercel.app"],
      },
    });

    new GatewayResponse(this, "UnauthorizedResponse", {
      restApi: this.api,
      type: ResponseType.UNAUTHORIZED,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'https://bookshelf-serverless.vercel.app'",
        "Access-Control-Allow-Headers": "'*'",
        "Access-Control-Allow-Methods": "'*'",
      },
      templates: {
        "application/json": JSON.stringify({ message: "Unauthorized: missing or invalid token" }),
      },
    });

    // define API gateway models
    this.createBookModel = buildCreateBookModel(this, this.api);
    this.updateBookModel = buildUpdateBookModel(this, this.api); 
    this.authModel = buildAuthModel(this, this.api);

    // define API request validators
    this.createBookRequestValidator = buildCreateBookRequestValidator(this, this.api);
    this.updateBookRequestValidator = buildUpdateBookRequestValidator(this, this.api);
    this.deleteBookRequestValidator = buildDeleteBookRequestValidator(this, this.api);
    this.authRequestValidator = buildAuthRequestValidator(this, this.api);


    // define Authorizer
        
    // define AWS Lambda for Authorizer
    const authorizerLambda = new NodejsFunction(this, 'AuthorizerLambda', {
        runtime: Runtime.NODEJS_22_X,
        entry: path.join(__dirname, '../lambdas/auth/authorizer.ts'),
        handler: 'handler',
        environment: {
            JWT_SECRET_KEY_PARAM_NAME: props.jwtSecretParam.parameterName,
        },
        timeout: cdk.Duration.seconds(4),
    });  
    props.jwtSecretParam.grantRead(authorizerLambda);

    const authorizer = new TokenAuthorizer(this, 'Authorizer', {
      handler: authorizerLambda,
      identitySource: 'method.request.header.Authorization',
      resultsCacheTtl: cdk.Duration.seconds(0), // disable caching
    });

    this.authorizer=authorizer;
  } 
}
