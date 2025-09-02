import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../../db-client';
import {v4 as uuidv4} from 'uuid';
import { handleError } from "../../services/error-handler";
import { getExistingUser } from "../../services/user-services";
import bcrypt from 'bcryptjs';

interface CreateUserType {
    PK: string,
    SK: string,
    username: string,
    hashedPassword: string,
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
        };        
        await dynamo.put({
            TableName: process.env.DB_TABLE_NAME,
            Item: insertedUser,
        });
        
        return {
            statusCode: 201,
            // TODO: return JWT token and remove message
            body: JSON.stringify({
                message: 'User created successfully',
                username: insertedUser.username,
            }),
        }
    } catch (err) {
        return handleError(err);
    }
}