# Disco AI Storyteller

**Disco** is an AI-powered comedy character built on top of the classic SAM.js retro text-to-speech engine.

He is poor, jobless, wildly confident, and completely convinced that every successful person around him owes at least part of that success to him.

His greatest historical achievement?

> "I took them to Lahore."

According to Disco, if he had never taken his friends to Lahore, none of them would have found jobs, moved abroad, bought cars, got married, started businesses, or become successful.

Unfortunately, every problem in Disco's own life is also somehow his friends' fault.

## What this project does

The app turns a simple situation into an original English comedy monologue and then lets Disco tell the story using the retro SAM voice.

Example prompt:

> My friend got a job in Dubai and Disco claims it only happened because he once took him to Lahore.

The AI generates a new first-person Disco incident using:

- Pakistani everyday-life observations
- fast counter-jokes and escalating arguments
- deliberate misunderstandings
- self-roasts
- callbacks
- exaggerated revisionist history
- character impressions
- social satire
- cheeky double meanings when enabled
- Disco's permanent Lahore obsession

The comedy mechanics are inspired by the tradition of Pakistani Punjabi stage comedy, but generated material is designed to be original rather than reproducing performers' routines verbatim.

## Disco's character

Disco believes:

- Every good thing in his friends' lives is partly his contribution.
- Every bad thing in his own life is his friends' fault.
- Taking somebody to Lahore counts as lifelong mentorship.
- Being unemployed does not mean he lacks career expertise.
- Having no money does not disqualify him from giving investment advice.
- Having no successful business does not stop him from advising businessmen.
- Losing an argument simply means the other person misunderstood his logic.

Underneath all the nonsense, Disco is not cruel. His strongest jokes usually end with him losing more dignity than the person he was teasing.

## Features

- AI-generated English Disco stories
- Short, Medium and Long story modes
- Clean comedy mode
- Cheeky / double-meaning mode
- Surprise story topics
- Editable generated script
- Copy Script
- SAM.js speech playback
- Long-story speech chunking
- Stop playback
- WAV export
- Adjustable speed, pitch, throat and mouth settings
- Server-side OpenAI API integration
- No API key exposed in browser code

## Architecture

```text
Situation / Topic
      |
      v
Disco Character Prompt
      |
      v
OpenAI Responses API
      |
      v
Original English Disco Story
      |
      v
SAM.js Text-to-Speech
      |
      v
Disco speaks
```

The original SAM synthesis engine remains isolated from the AI layer. The AI generates text only. The existing SAM.js engine then converts that text into speech.

## Setup

Install dependencies:

```bash
yarn
```

Build SAM.js:

```bash
yarn build
```

For AI story generation, configure the server environment:

```bash
OPENAI_API_KEY=your_api_key_here
```

Optional model override:

```bash
DISCO_MODEL=gpt-5.6-luna
```

The project includes a server-side endpoint at:

```text
POST /api/disco-story
```

Opening `index.html` directly still allows manual SAM speech, but AI generation requires a deployment/runtime that supports the server-side API route.

See [DISCO_SETUP.md](DISCO_SETUP.md) for implementation details.

## Disco voice

The current Disco voice uses SAM, the Software Automatic Mouth.

Default Disco preset:

```text
Speed:  76
Pitch:  58
Throat: 138
Mouth:  152
```

The intentionally retro sound gives Disco a strange, recognizable personality. The controls can be changed from the interface.

## Original SAM.js foundation

This repository is built from **SAM.js**, a JavaScript port of **SAM - Software Automatic Mouth**, originally published for the Commodore C64 by Don't Ask Software.

The SAM.js implementation is based on work by Stefan Macke, Vidar Hokstad, 8BitPimp, Christian Schiffler / discordier, and project contributors.

The original speech engine includes a text-to-phoneme reciter and phoneme-to-speech renderer.

The original SAM documentation remains available in [docs/manual.md](docs/manual.md).

## License and attribution

The underlying SAM software is a reverse-engineered implementation of older commercial speech software. Its historical licensing status is unusual and the original SAM.js project describes it as abandonware.

This project preserves that underlying engine and attribution. Use the SAM-derived portions with the same caution described by the upstream project.

The original AI character, Disco-specific prompts, application UI, and integration code are additions in this repository.

## Repository

Created and developed as the home of the **Disco AI Storyteller**.

Disco's version of the project history is simpler:

> "The AI wrote the stories. SAM made the sound. But obviously the whole thing happened because I took everybody to Lahore."
