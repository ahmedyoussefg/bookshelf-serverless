import { RequestValidator, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

const buildCreateBookRequestValidator = (scope: Construct, api: RestApi) => {
    return new RequestValidator(scope, 'CreateBookRequestValidator', {
        restApi: api,
        requestValidatorName: 'ValidateCreateBookRequest',
        validateRequestBody: true,
    });
};

export default buildCreateBookRequestValidator;