import client from "./client";

export const downloadExcel = async ({
    year,
    month,
    category,
    type,
    startDate,
    endDate,
    minAmount,
    maxAmount
}) => {

    const response = await client.get("/reports/excel", {

        params: {
            year,
            month,
            category,
            type,
            startDate,
            endDate,
            minAmount,
            maxAmount
        },

        responseType: "blob"

    });

    return response.data;
};