import { APIGatewayEvent, APIGatewayProxyCallback, Context } from "aws-lambda";
import dynamo from '../db-client';
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
        let statusCode = 500;
        let message = "Internal Server Error";
        if (err && typeof err === "object") {
            if (err instanceof Error) {
                message = err.message || message;
            }
            if ("statusCode" in err && typeof (err as any).statusCode === "number") {
                statusCode = (err as any).statusCode;
            }
        }
        return {
            statusCode,
            body: JSON.stringify({ message }),
        };
    }
}