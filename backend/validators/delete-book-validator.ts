import { RequestValidator, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

const buildDeleteBookRequestValidator = (scope: Construct, api: RestApi) => {
    return new RequestValidator(scope, 'DeleteBookRequestValidator', {
        restApi: api,
        requestValidatorName: 'ValidateDeleteBookRequest',
        validateRequestParameters: true,
    });
};

export default buildDeleteBookRequestValidator;