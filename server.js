const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const multer = require('multer');

// Load environment config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (Requires serviceAccountKey.json)
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin Initialized Successfully.');
  } else {
      console.warn('Firebase Admin skipped: No FIREBASE_SERVICE_ACCOUNT_KEY defined.');
  }
} catch (error) {
  console.error("Firebase Admin Error:", error.message);
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// We will mount router modules here in Phase 3
// const aiRoutes = require('./routes/ai');
// app.use('/api', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
});
