# Space Explorer

A beginner-friendly React and Express full-stack demo. The Express API serves the planet catalog from a JavaScript array. Saved planets are stored separately in the browser's localStorage and remain available after refresh in the same browser.

The localStorage database supports listing saved planets, saving or updating a planet by name, and removing a saved planet. It is local to the current browser and is not shared across devices or users. The explorer also includes satellite and star explanations, a five-question quiz with scoring and grades, a searchable library of 100 space facts, and theory explainers with images loaded from NASA's public image API.

## Run locally

Start the Express server in one terminal:

```powershell
cd react\server
npm start
```

Start the React development server in a second terminal:

```powershell
cd react
npm run dev
```

Open the Vite URL shown in the second terminal. The React page loads planet data from Express through Vite's proxy.

## API

- `GET /` - API name and available endpoints
- `GET /api/health` - checks that the server is running
- `GET /api/planets` - returns all planet data
- `GET /api/planets/:name` - returns one planet, for example `/api/planets/Earth`

## Browser storage

Select a planet and choose **Save Planet** to add it to **My Saved Planets**. Use **Remove** to delete it. Records are stored under the `space-explorer:saved-planets` localStorage key.

## Checks

From the `react` folder, run `npm run lint` and `npm run build`.
