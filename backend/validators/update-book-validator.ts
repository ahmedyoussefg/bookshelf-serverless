import { RequestValidator, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

const buildUpdateBookRequestValidator = (scope: Construct, api: RestApi) => {
    return new RequestValidator(scope, 'UpdateBookRequestValidator', {
        restApi: api,
        requestValidatorName: 'ValidateUpdateBookRequest',
        validateRequestBody: true,
        validateRequestParameters: true,
    });
};

export default buildUpdateBookRequestValidator;