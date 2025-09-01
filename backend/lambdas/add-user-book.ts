import { APIGatewayEvent } from "aws-lambda";
import dynamo from '../db-client';
import {v4 as uuidv4} from 'uuid';
import { handleError } from "../services/error-handler";

interface CreateBookType {
    PK: string,
    SK: string,
    title: string,
    author: string,
    genre: string,
    owned: boolean,
    readStatus: string,
    createdAt: string,
    bookId: string,
    userId: string,
    starred?: string,
};
export const handler = async (event: APIGatewayEvent) => {
    const userId = '1';
    const PK = `USER#${userId}`;
    const bookId = uuidv4();
    const SK = `BOOK#${bookId}`;
    try {
        const data = JSON.parse(event.body!);
        // Set starred to the creationDate if true
        const createdAt = new Date().toISOString();
        const starredValue = data.starred ?  createdAt: undefined;
        const insertedBook: CreateBookType = {
            PK,
            SK,
            userId,
            bookId,
            createdAt,
            title: data.title,
            author: data.author,
            owned: data.owned,
            genre: data.genre,
            readStatus: data.readStatus,
        };
        if (starredValue) {
            insertedBook.starred = starredValue;
        }
        await dynamo.put({
            TableName: process.env.DB_TABLE_NAME,
            Item: insertedBook,
        })
        return {
            statusCode: 201,
            body: JSON.stringify({
                id: insertedBook.bookId,
                title: insertedBook.title,
                author: insertedBook.author,
                genre: insertedBook.genre,
                owned: insertedBook.owned,
                readStatus: insertedBook.readStatus,
                starred: insertedBook.starred ? true : false,
            }),
        }
    } catch (err) {
        return handleError(err);
    }
}