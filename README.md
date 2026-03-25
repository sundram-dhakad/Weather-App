# Weather-info24x7

[LIVE LINK](https://weather-info24x7.vercel.app/)

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

## Vercel Deployment

This repo is configured for Vercel using a Serverless Function at `api/weather.js`.

1. Push your code to GitHub.
2. In Vercel, click `Add New...` -> `Project` and import your repository.
3. Keep default project settings (no custom build command required).
4. Add environment variable in Vercel:
- Key: `VISUAL_CROSSING_API_KEY`
- Value: your Visual Crossing API key
5. Deploy.

The frontend calls `/api/weather`, and Vercel routes that path to the function in `api/weather.js`.

## Notes

- Do not commit `.env`.
- If you rotated your key, update it in Vercel environment settings.
