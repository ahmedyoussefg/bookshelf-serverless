import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../../db-client';
import { getExistingBook } from "../../services/book-services";
import { handleError } from "../../services/error-handler";
import { CORS_HEADERS } from "../../constants/cors-constants";

export const handler = async (event: APIGatewayEvent) => {
    // Get user ID from authorizer
    const userId = event.requestContext.authorizer?.principalId;
    const bookId: string = event.pathParameters?.id!;
    try {
        const existingBook = await getExistingBook(userId, bookId);
        if (!existingBook) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Book not found" }),
                headers: CORS_HEADERS,
            };
        }
        await dynamo.delete({
            TableName: process.env.DB_TABLE_NAME,
            Key: {
                PK: existingBook.PK,
                SK: existingBook.SK,
            }
        })
        return {
            statusCode: 204,
            headers: CORS_HEADERS,
        }
    } catch (err) {
        return handleError(err);
    }
}