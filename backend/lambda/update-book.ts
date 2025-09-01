import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../db-client';

export const handler = async (event: APIGatewayEvent) => {
    const userId = '1';
    const bookId = event.pathParameters!.id;
    const PK = `USER#${userId}`;
    const SK = `BOOK#${bookId}`;
    // TODO: Remove this when we add validator
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request body is required" }),
        };
    }
    try {
        // TODO: extract this to another method
        const existingBookQuery = await dynamo.query({
            TableName: process.env.DB_TABLE_NAME,
            IndexName: process.env.BOOKID_INDEX_NAME,
            KeyConditionExpression: "PK=:pk AND bookId=:bookId",
            ExpressionAttributeValues:{
                ":pk":PK,
                ":bookId":bookId,
            }
        });

        if (!existingBookQuery.Items || existingBookQuery.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Book not found" }),
            };
        }
        const existingBook = existingBookQuery.Items[0];
        const data = JSON.parse(event.body);

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
                PK,
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
        console.log(err);
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