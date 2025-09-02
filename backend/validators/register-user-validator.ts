import { RequestValidator, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

const buildRegisterUserRequestValidator = (scope: Construct, api: RestApi) => {
    return new RequestValidator(scope, 'RegisterUserRequestValidator', {
        restApi: api,
        requestValidatorName: 'ValidateRegisterUserRequest',
        validateRequestBody: true,
    });
};

export default buildRegisterUserRequestValidator;