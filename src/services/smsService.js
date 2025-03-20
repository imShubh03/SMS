import axios from "axios";

export const sendSMS = async (message) => {
    try {
        const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
        const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
        const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
        const phoneNumber = "+919810153260"; //  number

        if (!accountSid || !authToken || !fromNumber) {
            throw new Error("Twilio credentials are missing. Check environment variables.");
        }

        if (!message) {
            throw new Error("Message content is required.");
        }

        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            new URLSearchParams({
                To: phoneNumber,
                From: fromNumber,
                Body: message,
            }),
            {
                auth: {
                    username: accountSid,
                    password: authToken,
                },
            }
        );

        console.log("SMS sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to send SMS");
    }
};
