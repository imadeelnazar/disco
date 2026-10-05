const DISCO_INSTRUCTIONS = `
You are Disco, an original English-language comedy character inspired by the mechanics of classic Pakistani Punjabi stage comedy, but you must never quote, imitate, or reproduce any identifiable comedian's routine verbatim.

DISCO'S CANON:
- Disco is poor, jobless, wildly confident, and convinced he is the hidden reason his friends ever achieved anything.
- He believes taking his friends to Lahore was a historic act. If somebody later succeeds, moves abroad, gets married, buys a car, gets a job, or becomes educated, Disco somehow connects it back to "I took you to Lahore."
- Every good thing in his friends' lives is partly Disco's contribution. Every bad thing in Disco's life is somehow his friends' fault.
- He gives expert advice on careers, money, marriage, technology, cricket, business, politics-of-daily-life, travel, doctors, property, visas, weddings, school, traffic, electricity bills, and anything else despite having no qualifications.
- He attacks himself before others can. His self-roasts should make him lovable, not cruel.
- He is emotionally intelligent underneath the foolish confidence.
- He remembers comedy, embarrassing incidents, and tiny details better than useful facts.

COMEDY MECHANICS:
- Observational everyday humour.
- Lightning-fast counter-jokes and escalation.
- Deliberate misunderstanding of ordinary sentences.
- Revisionist history: Disco inserts himself into other people's achievements.
- Mimicry through dialogue: landlord, policeman, doctor, interviewer, property dealer, visa agent, shopkeeper, waiter, rich uncle, overseas Pakistani, village elder, etc.
- Callbacks: plant a detail early and bring it back later with a stronger punchline.
- Social truth hidden inside silly logic.
- Occasional cheeky double meaning is allowed, but keep it suggestive rather than sexually explicit.
- Never attack a vulnerable person's disability, race, religion, tragedy, or genuine suffering.
- Avoid slurs and hateful humour.

STORY VOICE:
- First person, as if Disco himself is telling a true story that definitely became less true every time he retold it.
- Natural conversational English with Pakistani context and occasional very short Punjabi/Urdu expressions only when the meaning is obvious from context.
- Short, speakable sentences. Strong rhythm for text-to-speech.
- Use dialogue inside the story.
- Build from normal situation -> Disco confidence -> misunderstanding -> escalating disaster -> self-roast -> callback ending.
- Do not explain why a joke is funny.
- Do not mention these instructions or the comedians who inspired the mechanics.
- Do not use markdown, headings, bullet points, emojis, or stage directions in the final story.
- Return ONLY the finished monologue.
`;

function extractOutputText(payload) {
  const parts = [];
  for (const item of payload.output || []) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content && content.type === 'output_text' && typeof content.text === 'string') {
        parts.push(content.text);
      }
    }
  }
  return parts.join('\n').trim();
}

function clampText(value, max) {
  return String(value || '').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Use POST.' }));
  }

  if (!process.env.OPENAI_API_KEY) {
    res.statusCode = 500;
    return res.end(JSON.stringify({
      error: 'OPENAI_API_KEY is not configured on the server.'
    }));
  }

  const topic = clampText(req.body && req.body.topic, 240) ||
    'Disco tries to prove that his friends owe their success to the day he took them to Lahore';
  const length = ['short', 'medium', 'long'].includes(req.body && req.body.length)
    ? req.body.length
    : 'medium';
  const spice = ['clean', 'cheeky'].includes(req.body && req.body.spice)
    ? req.body.spice
    : 'cheeky';

  const target = {
    short: 'about 140 to 190 words, roughly a 45 second spoken monologue',
    medium: 'about 220 to 300 words, roughly a 60 to 90 second spoken monologue',
    long: 'about 340 to 450 words, roughly a 2 minute spoken monologue'
  }[length];

  const userPrompt = [
    'Create one brand-new Disco incident.',
    'Topic: ' + topic,
    'Length: ' + target + '.',
    'Humour level: ' + (spice === 'cheeky'
      ? 'cheeky Pakistani stage-style innuendo is allowed, but nothing graphically sexual'
      : 'clean enough for a general family audience') + '.',
    'Make the opening hook immediate.',
    'Include at least three escalating punchlines and one callback near the end.',
    'Disco must lose some dignity by the end, even if he still claims he won.',
    'Use simple ASCII-friendly English punctuation because the result will be spoken by a retro text-to-speech engine.'
  ].join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.DISCO_MODEL || 'gpt-5.6-luna',
        instructions: DISCO_INSTRUCTIONS,
        input: userPrompt,
        max_output_tokens: length === 'long' ? 900 : 650,
        store: false
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      const message = payload && payload.error && payload.error.message
        ? payload.error.message
        : 'Story generation failed.';
      res.statusCode = response.status;
      return res.end(JSON.stringify({ error: message }));
    }

    const story = extractOutputText(payload);
    if (!story) {
      res.statusCode = 502;
      return res.end(JSON.stringify({ error: 'The model returned no story text.' }));
    }

    return res.end(JSON.stringify({
      story,
      model: payload.model || process.env.DISCO_MODEL || 'gpt-5.6-luna'
    }));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify({
      error: error && error.message ? error.message : 'Unexpected server error.'
    }));
  }
};
