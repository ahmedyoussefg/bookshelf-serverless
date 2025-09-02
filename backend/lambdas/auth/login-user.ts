import { APIGatewayEvent } from "aws-lambda";
import { handleError } from "../../services/error-handler";
import { getExistingUser } from "../../services/user-services";
import bcrypt from 'bcryptjs';
import { generateToken } from "../../services/jwt-services";

export const handler = async (event: APIGatewayEvent) => {
    try {
        const { username, password } = JSON.parse(event.body!);
        const existingUser = await getExistingUser(username);
        if (!existingUser) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Invalid User Credentials",
                }),
            };
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.hashedPassword);

        if (!passwordMatch) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Invalid User Credentials",
                }),
            };
        }
        const token = await generateToken(existingUser.userId); 
    
        return {
            statusCode: 200,
            body: JSON.stringify({
                token,
                username: username,
            }),
        }
    } catch (err) {
        return handleError(err);
    }
}