const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const app = require("./server");

// Configure the function to use our Secret
setGlobalOptions({ 
    region: "us-central1"
});

// Export the Express app as a Cloud Function
exports.api = onRequest({ timeoutSeconds: 60, secrets: ["GROQ_API_KEY"] }, app);
