import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../../db-client';
import { getExistingBook } from "../../services/book-services";
import { handleError } from "../../services/error-handler";

export const handler = async (event: APIGatewayEvent) => {
    const userId = '1';
    const bookId: string = event.pathParameters?.id!;
    try {
        const existingBook = await getExistingBook(userId, bookId);
        if (!existingBook) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Book not found" }),
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
        }
    } catch (err) {
        return handleError(err);
    }
}