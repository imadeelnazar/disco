# Disco AI Storyteller

This branch adds a story-generation layer in front of the existing SAM.js text-to-speech engine.

## How it works

1. The browser sends a topic, requested length, and comedy level to `POST /api/disco-story`.
2. The server-side function calls the OpenAI Responses API using Disco's permanent character instructions.
3. The generated English monologue is returned to the browser.
4. The existing SAM.js engine speaks the story in short chunks so longer monologues are more reliable.

The API key never appears in browser code.

## Required environment variables

```bash
OPENAI_API_KEY=your_api_key_here
```

Optional:

```bash
DISCO_MODEL=gpt-5.6-luna
```

`gpt-5.6-luna` is the default because the story task is high-volume creative generation and does not need a large reasoning model.

## Deployment

The `api/disco-story.js` file is written as a Node/Vercel-style serverless function. Deploy the repository to a host that supports a server-side `/api` route, then add `OPENAI_API_KEY` as an environment variable.

Opening `index.html` directly from disk will still let you use the SAM voice on text you type manually, but AI story generation requires the server-side endpoint.

## Disco canon encoded in the prompt

- Poor and jobless, but extremely confident.
- Claims his friends' successes came from him.
- Treats taking his friends to Lahore as a historic turning point in their lives.
- Blames friends for his own failures.
- Uses observational humour, counter-jokes, callbacks, deliberate misunderstanding, mimicry, social satire and self-roasts.
- Stage-comedy mechanics are inspirations only; the model is explicitly told not to reproduce any comedian's material verbatim.
- English-first output with Pakistani context.
- Cheeky mode permits suggestive double meaning without graphic sexual content.
