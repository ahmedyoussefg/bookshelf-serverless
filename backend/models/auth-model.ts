import { JsonSchemaType, JsonSchemaVersion, Model, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export function buildAuthModel(scope:Construct, api: RestApi): Model {
    return new Model(scope, 'AuthModel', {
        restApi: api,
        contentType: "application/json",
        schema: {
            title: "AuthModel",
            schema: JsonSchemaVersion.DRAFT4,
            type: JsonSchemaType.OBJECT,
            properties: {
                username: {
                    type: JsonSchemaType.STRING,
                    minLength: 3,
                    pattern: '^\\S*$', // nowhitespaces
                },
                password: {
                    type: JsonSchemaType.STRING,
                    minLength: 8,
                    // at least 1 lowercase, 1 uppercase, 1 number
                    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$'
                }
            },
            required: ['username', 'password'],
        },
    });
}
export default buildAuthModel;