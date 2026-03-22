const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const fetch = require('node-fetch');

async function analyseResume(text) {
  const prompt = `You are an expert resume reviewer. Analyse this resume and return ONLY a JSON object.

Resume:
"""
${text.slice(0, 6000)}
"""

Return ONLY this JSON structure, no extra text:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence assessment>",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"],
  "keywords": {
    "found": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "missing": ["missing1", "missing2", "missing3"]
  },
  "sections": {
    "hasContact": true,
    "hasEducation": true,
    "hasExperience": true,
    "hasSkills": true,
    "hasSummary": false,
    "hasProjects": false
  }
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are a resume reviewer. Respond with valid JSON only. No markdown, no extra text.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const data = await response.json();
  console.log('Groq status:', response.status);
  console.log('Groq response:', JSON.stringify(data).slice(0, 300));

  if (!data.choices || !data.choices[0]) {
    throw new Error('Groq API error: ' + JSON.stringify(data));
  }

  const raw = data.choices[0].message.content || '{}';
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    let extractedText = '';
    try {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } catch (err) {
      return res.status(400).json({ error: 'Could not parse PDF.' });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: 'PDF is empty or scanned.' });
    }

    const resume = new Resume({
      fileName: req.file.originalname,
      fileSize: req.file.size,
      extractedText,
      status: 'processing',
    });
    await resume.save();

    let analysis;
    try {
      analysis = await analyseResume(extractedText);
    } catch (err) {
      console.error('AI error:', err.message);
      resume.status = 'failed';
      await resume.save();
      return res.status(500).json({ error: 'AI analysis failed: ' + err.message });
    }

    resume.analysis = analysis;
    resume.status = 'completed';
    await resume.save();
    res.json({ success: true, resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ status: 'completed' })
      .select('-extractedText').sort({ createdAt: -1 }).limit(20);
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select('-extractedText');
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};