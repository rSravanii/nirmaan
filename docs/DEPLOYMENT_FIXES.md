# Nirmaan deployment configuration

## Vercel frontend
Set these Environment Variables in the Vercel project:

```text
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
VITE_SOCKET_URL=https://YOUR-RENDER-SERVICE.onrender.com
VITE_DEMO_MODE=true
```

Redeploy after changing them.

## Render backend
Set:

```text
NODE_ENV=production
DEMO_MODE=true
AI_PROVIDER=auto
CLIENT_URL=https://nirmaan-sih-chi.vercel.app,http://localhost:5173
JWT_SECRET=<long-random-secret>
MONGODB_URI=<persistent-mongodb-atlas-uri>
ALLOW_MEMORY_DB_FALLBACK=false
```

For a temporary SIH demo without MongoDB Atlas, `ALLOW_MEMORY_DB_FALLBACK=true` can be used. The health endpoint reports that the database is in-memory demo mode; data can disappear after a server restart.

If `AI_API_KEY` is configured, the backend automatically uses Google Gemini. Otherwise it uses the deterministic local demo provider so the prototype remains usable.

Recommended current Gemini settings:

```text
AI_MODEL=gemini-3.8-flash
AI_EMBEDDING_MODEL=gemini-embedding-001
```

## Mobile camera
The live camera requires HTTPS. The UI also provides an `image/*` upload input with `capture="environment"`, which lets supported mobile browsers open the rear camera as a fallback.

## Submission flow
Problem reports are submitted as `multipart/form-data` so images are handled by Multer rather than embedding large base64 images inside JSON.
