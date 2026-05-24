const express = require("express");
const cors    = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- donnees en memoire ----------

let users = [
  { id: 1, username: "admin", password: "1234" }
];
let products = [
  {
    id: 1,
    name: "Telephone",
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
    storeName: "Magasin Atlas",
    storeAddress: "Rue Moulay Ismail, Taroudant",
    info: "Smartphones et accessoires"
  },
  {
    id: 2,
    name: "Livre",
    image: "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg",
    storeName: "Librairie Al Amal",
    storeAddress: "Place Assarag, Taroudant",
    info: "Livres scolaires et romans"
  },
  {
    id: 3,
    name: "Velo",
    image: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg",
    storeName: "Velos Taroudant",
    storeAddress: "Hay Salam, Taroudant",
    info: "Velos et pieces detachees"
  }
];

let stores = [
  { id: 1, productId: 1, name: "Magasin Atlas",    address: "Rue Moulay Ismail, Taroudant", phone: "0528852001", ratings: [4, 5] },
  { id: 2, productId: 1, name: "Tech Souss",        address: "Avenue Hassan II, Taroudant",  phone: "0528852002", ratings: [3, 4] },
  { id: 3, productId: 2, name: "Librairie Al Amal", address: "Place Assarag, Taroudant",     phone: "0528852003", ratings: [5, 5] },
  { id: 4, productId: 3, name: "Velos Taroudant",   address: "Hay Salam, Taroudant",         phone: "0528852004", ratings: [4]    }
];

let favorites = [];

let nextUserId    = 2;
let nextStoreId   = 5;
let nextFavId     = 1;

function moyenne(ratings) {
  if (ratings.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < ratings.length; i++) total += ratings[i];
  return parseFloat((total / ratings.length).toFixed(1));
}

// ---------- inscription ----------
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username et password requis" });
  if (users.find(u => u.username === username)) return res.status(409).json({ error: "Utilisateur existe deja" });
  const newUser = { id: nextUserId++, username, password };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, username: newUser.username });
});

// ---------- connexion ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Identifiants incorrects" });
  res.json({ id: user.id, username: user.username });
});

// ---------- produits (lecture seule) ----------
app.get("/products", (req, res) => {
  const search = req.query.search;
  if (search) {
    const result = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return res.json(result);
  }
  res.json(products);
});

// ---------- magasins ----------
app.get("/stores/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const result = stores.filter(s => s.productId === productId).map(s => ({
    ...s,
    rating: moyenne(s.ratings)
  }));
  res.json(result);
});

app.post("/stores", (req, res) => {
  const { productId, name, address, phone, userId } = req.body;
  if (!productId || !name || !address || !phone) return res.status(400).json({ error: "Champs requis" });
  const newStore = { id: nextStoreId++, productId, name, address, phone, ratings: [], userId };
  stores.push(newStore);
  res.status(201).json({ ...newStore, rating: 0 });
});

app.put("/stores/:storeId/rate", (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const rating = parseInt(req.body.rating);
  const store = stores.find(s => s.id === storeId);
  if (!store) return res.status(404).json({ error: "Magasin introuvable" });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: "Note entre 1 et 5" });
  store.ratings.push(rating);
  res.json({ ...store, rating: moyenne(store.ratings) });
});

// ---------- favoris ----------
app.get("/favorites/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const result = favorites.filter(f => f.userId === userId);
  res.json(result);
});

app.post("/favorites", (req, res) => {
  const { userId, storeId, storeName } = req.body;
  if (!userId || !storeId || !storeName) return res.status(400).json({ error: "Champs requis" });
  if (favorites.find(f => f.userId === userId && f.storeId === storeId))
    return res.status(409).json({ error: "Deja dans les favoris" });
  const newFav = { id: nextFavId++, userId, storeId, storeName };
  favorites.push(newFav);
  res.status(201).json(newFav);
});

app.delete("/favorites/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = favorites.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: "Favori introuvable" });
  favorites.splice(index, 1);
  res.json({ success: true });
});

// ---------- demarrage ----------
app.listen(3000, "0.0.0.0", () => {
  console.log("Serveur demarre sur http://0.0.0.0:3000");
});