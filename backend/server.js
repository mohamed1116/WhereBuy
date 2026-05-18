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
    image: "https://cdn-icons-png.flaticon.com/512/0/191.png",
    storeName: "Magasin Atlas",
    storeAddress: "Rue Moulay Ismail, Taroudant",
    info: "Smartphones et accessoires",
    latitude: 30.4727,
    longitude: -8.8746
  },
  {
    id: 2,
    name: "Livre",
    image: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
    storeName: "Librairie Al Amal",
    storeAddress: "Place Assarag, Taroudant",
    info: "Livres scolaires et romans",
    latitude: 30.4712,
    longitude: -8.8761
  },
  {
    id: 3,
    name: "Velo",
    image: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    storeName: "Velos Taroudant",
    storeAddress: "Hay Salam, Taroudant",
    info: "Velos et pieces detachees",
    latitude: 30.4698,
    longitude: -8.8712
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
let nextProductId = 4;
let nextStoreId   = 5;
let nextFavId     = 1;

// calcule la moyenne des notes
function moyenne(ratings) {
  if (ratings.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < ratings.length; i++) {
    total = total + ratings[i];
  }
  return parseFloat((total / ratings.length).toFixed(1));
}

// ---------- inscription ----------

app.post("/register", function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: "username et password sont requis" });
  }

  let existe = users.find(function(u) { return u.username === username; });
  if (existe) {
    return res.status(409).json({ error: "Ce nom d'utilisateur existe deja" });
  }

  let newUser = { id: nextUserId, username: username, password: password };
  nextUserId = nextUserId + 1;
  users.push(newUser);

  res.status(201).json({ id: newUser.id, username: newUser.username });
});

// ---------- connexion ----------

app.post("/login", function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let user = users.find(function(u) {
    return u.username === username && u.password === password;
  });

  if (!user) {
    return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
  }

  res.json({ id: user.id, username: user.username });
});

// ---------- produits ----------

// lister / chercher
app.get("/products", function(req, res) {
  let search = req.query.search;

  if (search) {
    let resultat = products.filter(function(p) {
      return p.name.toLowerCase().includes(search.toLowerCase());
    });
    return res.json(resultat);
  }

  res.json(products);
});

// ajouter un produit
app.post("/products", function(req, res) {
  let name         = req.body.name;
  let image        = req.body.image        || "";
  let storeName    = req.body.storeName    || "";
  let storeAddress = req.body.storeAddress || "";
  let info         = req.body.info         || "";
  let latitude     = req.body.latitude     || null;
  let longitude    = req.body.longitude    || null;

  if (!name) {
    return res.status(400).json({ error: "Le nom est requis" });
  }

  let newProduct = {
    id:           nextProductId,
    name:         name,
    image:        image,
    storeName:    storeName,
    storeAddress: storeAddress,
    info:         info,
    latitude:     latitude,
    longitude:    longitude
  };
  nextProductId = nextProductId + 1;
  products.push(newProduct);

  res.status(201).json(newProduct);
});

// modifier un produit
app.put("/products/:id", function(req, res) {
  let id = parseInt(req.params.id);

  let product = products.find(function(p) { return p.id === id; });
  if (!product) {
    return res.status(404).json({ error: "Produit introuvable" });
  }

  // on met a jour seulement les champs envoyes
  if (req.body.name         !== undefined) product.name         = req.body.name;
  if (req.body.image        !== undefined) product.image        = req.body.image;
  if (req.body.storeName    !== undefined) product.storeName    = req.body.storeName;
  if (req.body.storeAddress !== undefined) product.storeAddress = req.body.storeAddress;
  if (req.body.info         !== undefined) product.info         = req.body.info;
  if (req.body.latitude     !== undefined) product.latitude     = req.body.latitude;
  if (req.body.longitude    !== undefined) product.longitude    = req.body.longitude;

  res.json(product);
});

// supprimer un produit
app.delete("/products/:id", function(req, res) {
  let id    = parseInt(req.params.id);
  let index = products.findIndex(function(p) { return p.id === id; });

  if (index === -1) {
    return res.status(404).json({ error: "Produit introuvable" });
  }

  products.splice(index, 1);
  res.json({ success: true });
});

// ---------- magasins ----------

app.get("/stores/:productId", function(req, res) {
  let productId = parseInt(req.params.productId);

  let result = stores.filter(function(s) {
    return s.productId === productId;
  });

  let resultAvecNote = result.map(function(s) {
    return {
      id:        s.id,
      productId: s.productId,
      name:      s.name,
      address:   s.address,
      phone:     s.phone,
      ratings:   s.ratings,
      rating:    moyenne(s.ratings)
    };
  });

  res.json(resultAvecNote);
});

app.post("/stores", function(req, res) {
  let productId = req.body.productId;
  let name      = req.body.name;
  let address   = req.body.address;
  let phone     = req.body.phone;
  let userId    = req.body.userId;

  if (!productId || !name || !address || !phone) {
    return res.status(400).json({ error: "productId, name, address et phone sont requis" });
  }

  let newStore = {
    id:        nextStoreId,
    productId: productId,
    name:      name,
    address:   address,
    phone:     phone,
    ratings:   [],
    userId:    userId
  };
  nextStoreId = nextStoreId + 1;
  stores.push(newStore);

  res.status(201).json({ ...newStore, rating: 0 });
});

app.put("/stores/:storeId/rate", function(req, res) {
  let storeId = parseInt(req.params.storeId);
  let rating  = parseInt(req.body.rating);

  let store = stores.find(function(s) { return s.id === storeId; });
  if (!store) {
    return res.status(404).json({ error: "Magasin introuvable" });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "La note doit etre entre 1 et 5" });
  }

  store.ratings.push(rating);

  res.json({
    id:        store.id,
    productId: store.productId,
    name:      store.name,
    address:   store.address,
    phone:     store.phone,
    ratings:   store.ratings,
    rating:    moyenne(store.ratings)
  });
});

// ---------- favoris ----------

app.get("/favorites/:userId", function(req, res) {
  let userId = parseInt(req.params.userId);
  let result = favorites.filter(function(f) { return f.userId === userId; });
  res.json(result);
});

app.post("/favorites", function(req, res) {
  let userId    = req.body.userId;
  let storeId   = req.body.storeId;
  let storeName = req.body.storeName;

  if (!userId || !storeId || !storeName) {
    return res.status(400).json({ error: "userId, storeId et storeName sont requis" });
  }

  let existe = favorites.find(function(f) {
    return f.userId === userId && f.storeId === storeId;
  });
  if (existe) {
    return res.status(409).json({ error: "Deja dans les favoris" });
  }

  let newFav = { id: nextFavId, userId: userId, storeId: storeId, storeName: storeName };
  nextFavId = nextFavId + 1;
  favorites.push(newFav);

  res.status(201).json(newFav);
});

app.delete("/favorites/:id", function(req, res) {
  let id    = parseInt(req.params.id);
  let index = favorites.findIndex(function(f) { return f.id === id; });

  if (index === -1) {
    return res.status(404).json({ error: "Favori introuvable" });
  }

  favorites.splice(index, 1);
  res.json({ success: true });
});

// ---------- demarrage ----------

app.listen(3000, "0.0.0.0", function() {
  console.log("Serveur demarre sur http://0.0.0.0:3000");
});
