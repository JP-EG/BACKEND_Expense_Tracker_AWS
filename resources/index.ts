// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

exports.handler = async function(event: any) {
    console.log("requests:", JSON.stringify(event));
    console.log("Generating uuid: ", uuidv4());
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: "Hello from Lambda!",
    };
};