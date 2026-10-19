const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order if one is unavailable or busy
const MODEL_FALLBACKS = [
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

const PROMPT = (resumeText, jobDescription) => `You are an expert HR applicant tracking system (ATS) semantic parser.
Analyze the candidate's resume against the job description.
Understand context deeply (e.g., matching "Git" to "Version Control" or "Express" to "Node framework").

Return ONLY a valid JSON object with exactly these fields:
{
  "matchScore": <number 0-100, overall match compatibility percentage>,
  "matchedSkills": <array of strings, skills found in both resume and job description>,
  "missingSkills": <array of strings, critical requirements from JD not present in resume>,
  "bonusSkills": <array of strings, extra value-add skills from resume not specifically requested>,
  "actionPlan": <string, clear concise markdown advice on how to improve this resume for this job>
}

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

// ─── Retry helper: retries up to maxRetries times with exponential backoff ─────
const withRetry = async (fn, maxRetries = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable =
        err.message?.includes('503') ||
        err.message?.includes('Service Unavailable') ||
        err.message?.includes('overloaded') ||
        err.message?.includes('high demand') ||
        err.message?.includes('429') ||
        err.message?.includes('RESOURCE_EXHAUSTED');

      if (isRetryable && attempt < maxRetries) {
        console.warn(`⚠️ Gemini busy (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
        await new Promise((res) => setTimeout(res, delayMs));
        delayMs *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
};

// ─── Core AI processing function called by the match controller ───────────────
const runAiMatch = async (extractedResumeText, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please set it in your environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = PROMPT(extractedResumeText, jobDescription);
  let lastError;

  // Try each model in order
  for (const modelName of MODEL_FALLBACKS) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);

      const parsed = await withRetry(async () => {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        // Strip markdown fences if returned
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
          text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        return JSON.parse(text);
      });

      // Validate required fields
      if (
        typeof parsed.matchScore !== 'number' ||
        !Array.isArray(parsed.matchedSkills) ||
        !Array.isArray(parsed.missingSkills) ||
        !Array.isArray(parsed.bonusSkills) ||
        typeof parsed.actionPlan !== 'string'
      ) {
        throw new Error('Unexpected response format from Gemini.');
      }

      console.log(`✅ Analysis complete using ${modelName}`);
      return parsed;
    } catch (err) {
      console.error(`❌ Model ${modelName} failed: ${err.message}`);
      lastError = err;
      // Continue to next fallback model
    }
  }

  throw new Error(`AI analysis engine failed after trying all models: ${lastError?.message}`);
};

module.exports = { runAiMatch };
