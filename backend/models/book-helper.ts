import { JsonSchemaType } from "aws-cdk-lib/aws-apigateway";
import genreEnum from "../types/genre-enum";
import readStatusEnum from "../types/read-status-enum";

export const bookProperties = {
  title: { type: JsonSchemaType.STRING, minLength: 1 },
  author: { type: JsonSchemaType.STRING, minLength: 1 },
  genre: { type: JsonSchemaType.STRING, enum: genreEnum },
  owned: { type: JsonSchemaType.BOOLEAN, },
  readStatus: { type: JsonSchemaType.STRING, enum: readStatusEnum },
  starred: { type: JsonSchemaType.BOOLEAN },
};