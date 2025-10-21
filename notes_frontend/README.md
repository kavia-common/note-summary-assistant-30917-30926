# Ocean Notes (LightningJS / Blits)

A modern notes application where users can create, view, and manage notes with auto-generated summaries. Built with Lightning 3 (Blits) and styled using the Ocean Professional theme.

## Features
- Create notes and auto-generate a short summary (first sentence or first 120 chars)
- List notes as clean cards with title, summary, date
- View full note content and delete notes
- Local persistence via browser localStorage
- Floating action button to quickly add a new note
- Ocean Professional theme (primary #2563EB, success/secondary #F59E0B, error #EF4444, background #f9fafb, surface #ffffff, text #111827)

## Getting started

Install dependencies:
```sh
npm install
```

Run in development (port 3000):
```sh
npm run dev
```

Build for production:
```sh
npm run build
```

## Usage
- Press the + floating action button to create a note.
- Type content in the editor; press Enter on the Save button to save.
- Select a card to view a note; use Edit to modify or Delete to remove it.
- Notes persist across reloads.

## Tech
- Lightning 3, Blits, Vite
- No backend / external services required

## Notes
- Summaries are generated client-side using a simple heuristic (no AI).
- Data stored in localStorage under key notes_app_items_v1.

### Resources
- [Blits documentation](https://lightningjs.io/v3-docs/blits/getting_started/intro.html)
- [Blits Example App](https://blits-demo.lightningjs.io/?source=true)
- [Blits Components](https://lightningjs.io/blits-components.html)
