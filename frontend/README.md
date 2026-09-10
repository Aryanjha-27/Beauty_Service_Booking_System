# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

# GlowNext frontend

This folder contains the React and Vite frontend for GlowNext. Django remains the API and database owner.

From the project root, start Django first:

```powershell
python manage.py runserver
```

Then run the frontend:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

The React app reads live services from `/api/services/` and verified vendors from `/api/vendors/` on Django at `http://127.0.0.1:8000`.

Useful commands:

```powershell
npm run lint
npm run build
npm run preview
```

See the root [README](../README.md) for setup and [CODE_GUIDE.md](../CODE_GUIDE.md) for the file-by-file explanation.
