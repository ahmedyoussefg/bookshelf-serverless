import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../db-client';
import { handleError } from "../services/error-handler";
export const handler = async (event: APIGatewayEvent) => {
    const userId = '1';
    const PK = `USER#${userId}`;
    try {
        const results = await dynamo.query({
            TableName: process.env.DB_TABLE_NAME,
            KeyConditionExpression: "PK=:PK and begins_with(SK, :skPrefix)",
            ExpressionAttributeValues: {
                ":PK": PK,
                ":skPrefix": "BOOK#",
            },
        });
        const books = results.Items?.map(item => ({
            id: item.bookId,                  // rename bookId to id
            title: item.title,
            author: item.author,
            genre: item.genre,
            owned: item.owned,
            readStatus: item.readStatus,
            starred: !!item.starred           // true if starred exists, else false
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(books),
        }
    } catch (err) {
        return handleError(err);
    }
}