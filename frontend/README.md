# React + Vite

## Deployment configuration

Set `VITE_API_URL` to the public backend URL before building the frontend. Vite
embeds this value in the static bundle, so redeploy the frontend after changing it.

For Render, configure the frontend service with
`VITE_API_URL=https://<your-backend-service>.onrender.com` and the backend service
with `FRONTEND_ORIGINS=https://<your-frontend-service>.onrender.com` (no trailing
slash). The Nginx configuration supports direct React Router URLs such as
`/admin/login`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
