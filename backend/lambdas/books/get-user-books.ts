import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../../db-client';
import { handleError } from "../../services/error-handler";
import { CORS_HEADERS } from "../../constants/cors-constants";
export const handler = async (event: APIGatewayEvent) => {
    // Get user ID from authorizer
    const userId = event.requestContext.authorizer?.principalId;
    const PK = `USER#${userId}`;

    const hasStarredFilter = event.queryStringParameters?.starred === 'true';
    try {
        let results;
        if (hasStarredFilter){
            // Use GSI to get only starred books
            results = await dynamo.query({
                TableName: process.env.DB_TABLE_NAME,
                IndexName: process.env.STARRED_BOOKS_INDEX_NAME,
                KeyConditionExpression: "PK = :PK",
                ExpressionAttributeValues: {
                    ":PK": PK,
                },
                ScanIndexForward: false,
            });
        } else {
            results = await dynamo.query({
                TableName: process.env.DB_TABLE_NAME,
                KeyConditionExpression: "PK=:PK and begins_with(SK, :skPrefix)",
                ExpressionAttributeValues: {
                    ":PK": PK,
                    ":skPrefix": "BOOK#",
                },
                ScanIndexForward: false,
            });
        }

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
            headers: CORS_HEADERS,
        }
    } catch (err) {
        return handleError(err);
    }
}