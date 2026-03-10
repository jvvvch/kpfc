<div align="flex flex-row items-center justify-center gap-2">
    <img src="/docs/demo-1.png" alt="kpfc" height="400"/>
    <img src="/docs/demo-2.png" alt="kpfc" height="400"/>
    <img src="/docs/demo-3.png" alt="kpfc" height="400"/>
    <img src="/docs/demo-4.png" alt="kpfc" height="400"/>
</div>

## kpfc

**kpfc** (kcal, protein, fat, carbs) is a local-first personal food tracking mobile progressive web app. You can host it, access it once from you device and use it even if you're offline.

It is minimal and only has features I found useful after tracking my nutrition manually for a few months. If there's a feature you want that isn't here, feel free to open an issue or submit a PR.

I'm not a frontend guy, so the code might not be perfect, but it works.

Tech used: Vite, Preact, TailwindCSS, SQLite WASM, and an optional Golang server for hosting.

### Features

- **Daily goals**: set calorie and macro targets.
- **Products**: maintain a list of food products. You can specify name, brand, macros and optional weight per piece.
- **Meals**: combine products into reusable meals. You can also log eating only a percentage of a whole meal.
- **Dashboard**: track daily calorie and macro progress.
- **Languages**: English or Russian.
- **Themes**: light and dark.

## Getting started

kpfc is a progressive web app, so it must be served over HTTPS. It also means you don't need to host it permanently: after the first time you open it in a browser, the app is fully downloaded to your device.

The easiest way to start is to download the latest release and run the executable:

```sh
PORT=8080 ./kpfc
```

A minimal Golang server is included if you want to build the executable yourself:

```sh
bun install
bun run build
go build -o kpfc main.go
```
