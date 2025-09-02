import { RequestValidator, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

const buildAuthRequestValidator = (scope: Construct, api: RestApi) => {
    return new RequestValidator(scope, 'AuthRequestValidator', {
        restApi: api,
        requestValidatorName: 'ValidateAuthRequest',
        validateRequestBody: true,
    });
};

export default buildAuthRequestValidator;