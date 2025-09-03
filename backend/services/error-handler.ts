import { CORS_HEADERS } from "../constants/cors-constants";

export const handleError = (err: any) => {
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
        headers: CORS_HEADERS,
        body: JSON.stringify({ message }),
    };
};