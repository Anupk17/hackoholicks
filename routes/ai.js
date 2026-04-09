const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini with API key from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.0-flash';

// ─── Helper: call Gemini with a text prompt ──────────────────────────────
async function geminiText(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text;
}

// ═══════════════════════════════════════════════════════════════
// POST /api/process-interview
// Body: { transcript: String, question: String }
// Returns: Full AI coaching analysis JSON
// ═══════════════════════════════════════════════════════════════
router.post('/process-interview', async (req, res) => {
  const { transcript, question } = req.body;

  if (!transcript || transcript.trim().length < 10) {
    return res.status(400).json({ error: 'Transcript is too short to analyze.' });
  }

  const prompt = `
You are an elite interview coach analyzing a candidate's spoken answer.

Interview Question: "${question || 'General response'}"

Candidate's Answer (raw transcript):
"${transcript}"

Analyze this response and return a JSON object with exactly these fields:
{
  "overallScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "relevanceScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "fillerWordCount": <number>,
  "fillerWords": [<array of filler words found, e.g. "um", "uh", "like">],
  "starAnalysis": {
    "situation": "<brief assessment of Situation component>",
    "task": "<brief assessment of Task component>",
    "action": "<brief assessment of Action component>",
    "result": "<brief assessment of Result component>",
    "completeness": <number 0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "optimizedAnswer": "<a polished, rewritten version of the answer in 3-4 sentences using STAR format>",
  "coachingNote": "<one powerful personalized tip for this specific answer>"
}

Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    const raw = await geminiText(prompt);
    // Strip markdown code fences if present
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error('process-interview error:', err.message);
    res.status(500).json({ error: 'AI analysis failed. Check your Gemini API key.' });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/analyze-resume
// Body: multipart/form-data with field "resume" (PDF/text file)
//       OR { resumeText: String, jobTitle: String }
// Returns: ATS scoring and improvement suggestions
// ═══════════════════════════════════════════════════════════════
router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  let resumeText = req.body.resumeText || '';
  const jobTitle = req.body.jobTitle || 'Software Engineering';

  // If file uploaded, use its text content
  if (req.file) {
    resumeText = req.file.buffer.toString('utf-8');
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume content is too short or missing.' });
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and resume coach.

Target Job Title: "${jobTitle}"

Resume Content:
"""
${resumeText.substring(0, 4000)}
"""

Analyze this resume and return a JSON object with exactly these fields:
{
  "atsScore": <number 0-100>,
  "keywordMatch": <number 0-100>,
  "formattingScore": <number 0-100>,
  "impactScore": <number 0-100>,
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "strongKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "criticalIssues": ["<issue 1>", "<issue 2>"],
  "improvements": [
    { "section": "<section name>", "suggestion": "<specific improvement>" },
    { "section": "<section name>", "suggestion": "<specific improvement>" },
    { "section": "<section name>", "suggestion": "<specific improvement>" }
  ],
  "summary": "<2-sentence overall assessment of the resume>",
  "tailoredSummary": "<a rewritten professional summary tailored for the target job title>"
}

Return ONLY valid JSON. No markdown.`;

  try {
    const raw = await geminiText(prompt);
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error('analyze-resume error:', err.message);
    res.status(500).json({ error: 'Resume analysis failed.' });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/analyze-linkedin
// Body: { profileText: String, targetRole: String }
// Returns: LinkedIn profile optimization score and tips
// ═══════════════════════════════════════════════════════════════
router.post('/analyze-linkedin', async (req, res) => {
  const { profileText, targetRole } = req.body;

  if (!profileText || profileText.trim().length < 30) {
    return res.status(400).json({ error: 'LinkedIn profile content is too short.' });
  }

  const prompt = `
You are a LinkedIn profile optimization expert.

Target Role: "${targetRole || 'Tech Professional'}"

LinkedIn Profile Content:
"""
${profileText.substring(0, 3000)}
"""

Analyze this LinkedIn profile and return a JSON object with exactly these fields:
{
  "overallScore": <number 0-100>,
  "headlineScore": <number 0-100>,
  "summaryScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "keywordsScore": <number 0-100>,
  "connectabilityScore": <number 0-100>,
  "missingElements": ["<element 1>", "<element 2>", "<element 3>"],
  "topStrengths": ["<strength 1>", "<strength 2>"],
  "improvements": [
    { "section": "Headline", "current": "<current headline if found>", "suggested": "<optimized headline>" },
    { "section": "Summary", "issue": "<main issue>", "fix": "<specific fix>" },
    { "section": "Skills", "missing": ["<skill 1>", "<skill 2>", "<skill 3>"] }
  ],
  "profileSummary": "<a compelling, rewritten About section optimized for the target role in 3-4 sentences>"
}

Return ONLY valid JSON. No markdown.`;

  try {
    const raw = await geminiText(prompt);
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error('analyze-linkedin error:', err.message);
    res.status(500).json({ error: 'LinkedIn analysis failed.' });
  }
});

module.exports = router;
