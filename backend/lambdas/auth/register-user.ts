import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../../db-client';
import {v4 as uuidv4} from 'uuid';
import { handleError } from "../../services/error-handler";
import { getExistingUser } from "../../services/user-services";
import bcrypt from 'bcryptjs';
import { generateToken } from "../../services/jwt-services";
import { CORS_HEADERS } from "../../constants/cors-constants";

interface CreateUserType {
    PK: string,
    SK: string,
    username: string,
    hashedPassword: string,
    userId: string,
};

export const handler = async (event: APIGatewayEvent) => {
    const userId = uuidv4();
    const PK = `USER#${userId}`;
    // SK = PK
    try {
        const { username, password } = JSON.parse(event.body!);
        const existingUser = await getExistingUser(username);
        if (existingUser) {
            return {
                statusCode: 409,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "User already exists.",
                }),
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertedUser: CreateUserType = {
            PK,
            SK:PK,
            username,
            hashedPassword,
            userId,
        };        
        await dynamo.put({
            TableName: process.env.DB_TABLE_NAME,
            Item: insertedUser,
        });

        const token = await generateToken(userId);
        return {
            statusCode: 201,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                token: token,
                username: insertedUser.username,
            }),
        }
    } catch (err) {
        return handleError(err);
    }
}