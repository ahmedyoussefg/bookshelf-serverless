import { Effect, PolicyDocument } from "aws-cdk-lib/aws-iam";
import { APIGatewayAuthorizerResult } from "aws-lambda";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { loadJwtSecretKey } from "../../services/jwt-services";

export const handler = async function (event: any): Promise<APIGatewayAuthorizerResult> {
    console.log(`[Authorizer] event => ${JSON.stringify(event)}`);
    try {
        // For Token Authorizer, the token is in event.authorizationToken
        const authToken = event.authorizationToken || '';
        
        // Extract token by splitting on space and taking the last part
        const token = authToken.split(' ').pop() || '';
        
        if (!token) {
            throw new Error('No token provided');
        }
        
        const jwtSecretKeyValue = await loadJwtSecretKey();
        const decodedJWT = <JwtPayload>jwt.verify(token, jwtSecretKeyValue);

        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                Action: 'execute-api:Invoke',
                Effect: Effect.ALLOW,
                Resource: event['methodArn'],
                },
            ],
        };

        const response: APIGatewayAuthorizerResult = {
            principalId: decodedJWT.sub!,
            policyDocument,
        };
        console.log(`[Authorizer] response => ${JSON.stringify(response)}`);

        return response;
    } catch (err) {
        console.error('[Authorizer] Invalid auth token. err => ', err);
        throw new Error('Unauthorized');
    }
};