import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../../db-client';
import { getExistingBook } from "../../services/book-services";
import { handleError } from "../../services/error-handler";

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
            };
        }
        const data = JSON.parse(event.body!);

        const possibleFields = ["title", "author", "genre", "readStatus", "owned", "starred"];
        const attributeNamesMapping: Record<string, string> = {};
        const attributeValuesMapping: Record<string, any> = {};

        const setOps: string[] = [];
        const removeOps: string[] = [];

        for (const f of possibleFields) {
            if (f in data) {
                attributeNamesMapping[`#${f}`] =f;  
                if (f === "starred") {
                    if (data.starred) {
                        attributeValuesMapping[`:${f}`] = existingBook.createdAt;
                        setOps.push(`#${f} = :${f}`);
                    } else{
                        removeOps.push(`#${f}`);
                    }
                }
                else {
                    attributeValuesMapping[`:${f}`]=data[f];
                    setOps.push(`#${f} = :${f}`);
                }
            }
        }


        const updateExp =
          (setOps.length ? "SET " + setOps.join(", ") : "") +
          (removeOps.length ? " REMOVE " + removeOps.join(", ") : "");

        if (!updateExp) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No valid fields to update book" }),
            }
        }

        const result = await dynamo.update({
            TableName: process.env.DB_TABLE_NAME,
            Key: {
                PK: `USER#${userId}`,
                SK: existingBook.SK,
            },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: attributeNamesMapping,
            ExpressionAttributeValues: Object.keys(attributeValuesMapping).length > 0 ? attributeValuesMapping : undefined,
            ReturnValues: "ALL_NEW",
        });
        const updatedBook = result.Attributes;
        if (!updatedBook) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Failed to update book" }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: updatedBook.bookId,
                title: updatedBook.title,
                author: updatedBook.author,
                genre: updatedBook.genre,
                owned: updatedBook.owned,
                readStatus: updatedBook.readStatus,
                starred: updatedBook.starred ? true : false,
            }),
        }
    } catch (err) {
        return handleError(err);
    }
}