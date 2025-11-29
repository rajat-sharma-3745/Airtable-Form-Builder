export const errorMiddleware = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    if (err.isAxiosError) {
        const apiStatus = err.response?.status;

        if (apiStatus === 400) {
            statusCode = 400;
            message = err.response?.data?.error?.message || "Bad Request";
        }

        if (apiStatus === 401) {
            statusCode = 401;

            if (err.response?.data?.error?.type === "INVALID_AUTHENTICATION") {
                message = "Your Airtable access token is invalid or expired. Please log in again.";
            } else {
                message = "Unauthorized: access token missing or expired.";
            }
        }

        if (apiStatus === 403) {
            statusCode = 403;
            message = "Forbidden: You do not have permissions for this Airtable resource.";
        }

        if (apiStatus === 404) {
            statusCode = 404;
            message = "Requested Airtable resource not found.";
        }

        if (apiStatus === 429) {
            statusCode = 429;
            message = "Rate limit exceeded. Airtable API is throttling requests.";
        }
    }
    else if (err.code === "ERR_BAD_REQUEST") {
        statusCode = 400;
        message = "Airtable request failed. Possibly incorrect base/table/field ID.";
    }

    else if (err.code === "ECONNREFUSED") {
        statusCode = 500;
        message = "Server cannot reach Airtable. Connection refused.";
    }

    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token.";
    }

    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your login session expired. Please sign in again.";
    }
    res.status(statusCode).json({
        success: false,
        message
    })
}