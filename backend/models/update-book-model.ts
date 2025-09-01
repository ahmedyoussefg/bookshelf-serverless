import { JsonSchemaType, JsonSchemaVersion, Model, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { bookProperties } from "./book-helper";

export function buildUpdateBookModel(scope:Construct, api: RestApi): Model {
    return new Model(scope, 'UpdateBookModel', {
        restApi: api,
        contentType: "application/json",
        schema: {
            schema: JsonSchemaVersion.DRAFT4,
            title: "UpdateBookModel",
            type: JsonSchemaType.OBJECT,
            properties: bookProperties,
        },
    });
}
export default buildUpdateBookModel;