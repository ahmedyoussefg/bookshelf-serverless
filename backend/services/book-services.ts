import dynamo from "../db-client";

export async function getExistingBook(userId: string, bookId: string) {
  const PK = `USER#${userId}`;

  const existingBookQuery = await dynamo.query({
    TableName: process.env.DB_TABLE_NAME,
    IndexName: process.env.BOOKID_INDEX_NAME,
    KeyConditionExpression: "PK = :pk AND bookId = :bookId",
    ExpressionAttributeValues: {
      ":pk": PK,
      ":bookId": bookId,
    },
  });

  if (!existingBookQuery.Items || existingBookQuery.Items.length === 0) {
    return null;
  }

  return existingBookQuery.Items[0];
}