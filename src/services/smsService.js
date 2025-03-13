import axios from "axios";

// Set this to true to bypass actual Twilio API calls during development
const DEV_MODE = true;

export const sendSMS = async (phoneNumber, message) => {
    try {
        // Ensure required environment variables are set
        const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
        const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
        const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken || !fromNumber) {
            throw new Error("Twilio credentials are missing. Check environment variables.");
        }

        // Validate input
        if (!phoneNumber || !message) {
            throw new Error("Invalid phone number or message content.");
        }

        // For development mode: simulate a successful SMS send without calling Twilio
        if (DEV_MODE) {
            console.log("DEV MODE: Simulating SMS sent to:", phoneNumber);
            console.log("DEV MODE: Message content:", message);
            
            // Return a fake success response that mimics Twilio's format
            return {
                sid: "SM" + Math.random().toString(36).substring(2, 15),
                status: "queued",
                to: phoneNumber,
                from: fromNumber,
                body: message,
                date_created: new Date().toISOString(),
                date_sent: null,
                direction: "outbound-api",
                price: null,
                price_unit: "USD"
            };
        }

        // Real Twilio API request (only executed when DEV_MODE is false)
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
        
        // Check for the unverified number error from Twilio
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes("unverified") && errorMessage.includes("Trial accounts")) {
            throw new Error(
                `The phone number ${phoneNumber} is not verified. With a trial Twilio account, ` +
                `you need to verify recipient numbers at twilio.com/user/account/phone-numbers/verified ` +
                `or upgrade to a paid account. (Set DEV_MODE to true to bypass this error)`
            );
        }
        
        throw new Error(errorMessage || "Failed to send SMS");
    }
};
