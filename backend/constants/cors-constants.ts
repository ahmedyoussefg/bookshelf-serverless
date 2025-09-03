import { Cors } from "aws-cdk-lib/aws-apigateway";

export const CORS_HEADERS = {
  "Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": `'${Cors.ALL_METHODS.join(",")}'`,
};