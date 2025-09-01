import { JsonSchemaType, JsonSchemaVersion, Model, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { bookProperties } from "./book-helper";

export function buildCreateBookModel(scope:Construct, api: RestApi): Model {
    return new Model(scope, 'CreateBookModel', {
        restApi: api,
        contentType: "application/json",
        schema: {
            title: "CreateBookModel",
            schema: JsonSchemaVersion.DRAFT4,
            type: JsonSchemaType.OBJECT,
            properties: bookProperties,
            required: ["title", "author", "genre", "owned", "readStatus"],
        },
    });
}
export default buildCreateBookModel;