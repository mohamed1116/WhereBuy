# WhereBuy
WhereBuy – a full‑stack mobile app that helps users find local stores in Taroudant, Morocco. Built with React Native (Expo) and Express.
# Wherebuy — Taroudant

A mobile app that helps residents of Taroudant find **where to buy a specific product** in the city.

---

## What the app does

- Search for a product and find the stores that sell it
- Display product images from a URL
- Show store location on a map
- Rate stores with stars
- Add stores to favorites
- Add, edit, and delete products

---

## Project structure

```
pro/
├── backend/
│   └── server.js        ← Server (Express + Node.js)
│
└── frontend/
    ├── App.js           ← Navigation setup
    └── screens/
        ├── AuthScreen.js        ← Login / Register
        ├── HomeScreen.js        ← Home screen
        ├── StoresScreen.js      ← Product details & stores
        ├── AddProductScreen.js  ← Add a product
        ├── EditProductScreen.js ← Edit a product
        ├── MapScreen.js         ← Map view
        ├── PickLocationScreen.js← Pick a location on the map
        └── FavoritesScreen.js   ← Favorites
```

---

## Running the project

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run web        # browser
npx expo start     # mobile via Expo Go
```

---

## Login credentials

| Field | Value |
|-------|-------|
| username | `admin` |
| password | `1234` |

---

## Changing the IP address

If you switch Wi-Fi networks, update this line in every screen file:

```js
const URL = "http://192.168.4.103:3000";
```

To get your new IP: open `cmd` and type `ipconfig`

---

## Tech stack

| Part | Technology |
|------|------------|
| Frontend | React Native + Expo |
| Backend | Node.js + Express |
| HTTP | Axios |
| Maps | Leaflet (WebView) + Google Maps (Web) |
| Data | In-memory arrays (no database) |
