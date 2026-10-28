# Tasker - The planner

Tasker is a small, responsive daily task planner built with React and Vite. Add tasks, mark them complete, edit or remove them, and see your progress at a glance.

## Features

- Add, edit, complete, and delete tasks
- Filter the list to show all, active, or completed tasks
- See completion progress and task counts update as you work
- Keep tasks between visits with browser `localStorage`
- Use the layout on mobile, tablet, and desktop
- Navigate task controls with a keyboard and receive screen-reader announcements for task changes

## Getting started

You'll need Node.js 22 or later and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite to use the app.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Data and privacy

Tasks are stored in this browser on this device using `localStorage`. The app does not require an account or send task data to a server. Clearing this browser's site data will remove saved tasks.

## Deployment

The project is configured for GitHub Pages at the `/to-do-application/` path. The workflow in `.github/workflows/deploy.yml` builds and deploys the app when changes are pushed to `main` or when manually triggered in GitHub Actions.
