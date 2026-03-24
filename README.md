# Weather App

A weather forecast app powered by Visual Crossing.

## Local Run (Node server)

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set your key:

```env
VISUAL_CROSSING_API_KEY=your_key
PORT=3000
```

3. Start:

```bash
npm start
```

4. Open `http://localhost:3000`.

## Netlify Deployment (Git Repo)

This repo is configured for Netlify Functions.

1. Push your code to GitHub.
2. In Netlify, click `Add new site` -> `Import an existing project`.
3. Select your repository.
4. Build settings:
- Build command: leave empty
- Publish directory: `.`
- Functions directory: `netlify/functions`
5. Add environment variable in Netlify:
- Key: `VISUAL_CROSSING_API_KEY`
- Value: your Visual Crossing API key
6. Deploy.

The frontend calls `/api/weather`, and Netlify redirects it to the serverless function in `netlify/functions/weather.js`.

## Notes

- Do not commit `.env`.
- If you rotated your key, update it in Netlify environment settings.
