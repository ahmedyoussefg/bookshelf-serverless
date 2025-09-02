import dynamo from "../db-client";

export async function getExistingUser(username: string) {

  const existingUserQuery = await dynamo.query({
    TableName: process.env.DB_TABLE_NAME,
    IndexName: process.env.USERNAME_INDEX_NAME,
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  });

  if (!existingUserQuery.Items || existingUserQuery.Items.length === 0) {
    return null;
  }

  return existingUserQuery.Items[0];
}