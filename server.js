const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ─── Firebase Admin ──────────────────────────────────────────────────────────
try {
  const admin = require('firebase-admin');
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (keyPath && !keyPath.includes('PASTE') && !admin.apps.length) {
    const fs = require('fs');
    if (fs.existsSync(keyPath.replace('./', ''))) {
      const serviceAccount = require(keyPath);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('✅ Firebase Admin initialized.');
    } else {
      console.warn('⚠️  Firebase Admin: serviceAccountKey.json not found — skipping.');
    }
  } else {
    console.warn('⚠️  Firebase Admin: No service account key configured.');
  }
} catch (err) {
  console.warn('⚠️  Firebase Admin skipped:', err.message);
}

// ─── API Routes ──────────────────────────────────────────────────────────────
const aiRoutes = require('./routes/ai');
app.use('/api', aiRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    openRouterKey: process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing — add to .env',
  });
});

// ─── Fallback Route (serve landing page) ─────────────────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'interveux_landing_page', 'code.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 InterveuX Backend Server Running');
  console.log(`   URL:         http://localhost:${PORT}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health`);
  console.log(`   Interview:   POST http://localhost:${PORT}/api/process-interview`);
  console.log(`   Resume:      POST http://localhost:${PORT}/api/analyze-resume`);
  console.log(`   LinkedIn:    POST http://localhost:${PORT}/api/analyze-linkedin`);
  console.log('');
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('PASTE')) {
    console.warn('⚠️  OPENROUTER_API_KEY not set! Add your key to .env to enable AI features.');
  } else {
    console.log('✅ OpenRouter AI key loaded.');
  }
  console.log('');
});
