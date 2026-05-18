import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from "react-native";
import axios from "axios";

const URL = "http://192.168.4.103:3000";

export default function HomeScreen({ route, navigation }) {
  const { user } = route.params;
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => { loadProducts(""); }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      loadProducts("");
      setSearch("");
    });
    return unsub;
  }, [navigation]);

  async function loadProducts(text) {
    try {
      const res = await axios.get(URL + "/products", { params: { search: text } });
      setProducts(res.data);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les produits.");
    }
  }

  async function deleteProduct(id, name) {
    Alert.alert("Confirmation", `Supprimer "${name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(URL + "/products/" + id);
            loadProducts("");
          } catch {
            Alert.alert("Erreur", "Impossible de supprimer.");
          }
        }
      }
    ]);
  }

  function renderProduct({ item }) {
    return (
      <View style={styles.card}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Pas d'image</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.storeName    && <Text style={styles.detail}>Magasin : {item.storeName}</Text>}
          {item.storeAddress && <Text style={styles.detail}>Adresse : {item.storeAddress}</Text>}
          {item.info         && <Text style={styles.detail}>{item.info}</Text>}
          {item.latitude && item.longitude && (
            <Text style={styles.detail}>Position : {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btnView} onPress={() => navigation.navigate("Stores", { product: item, user })}>
            <Text style={styles.btnViewText}>Voir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={() => deleteProduct(item.id, item.name)}>
            <Text style={styles.btnDeleteText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bonjour, {user.username}</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.btnHeader} onPress={() => navigation.navigate("Favorites", { user })}>
            <Text style={styles.btnHeaderText}>Favoris</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnHeader} onPress={() => navigation.navigate("Map", {})}>
            <Text style={styles.btnHeaderText}>Carte</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput style={styles.input} placeholder="Rechercher un produit..." value={search} onChangeText={setSearch} />
        <TouchableOpacity style={styles.btnSearch} onPress={() => loadProducts(search)}>
          <Text style={styles.btnSearchText}>Chercher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnAdd} onPress={() => navigation.navigate("AddProduct", { user })}>
        <Text style={styles.btnAddText}>+ Ajouter un produit</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={styles.empty}>Aucun produit trouve.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },

  header:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                     marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  welcome:         { fontSize: 15, fontWeight: "600", color: "#222" },
  headerBtns:      { flexDirection: "row", gap: 8 },
  btnHeader:       { borderWidth: 1, borderColor: "#1a3c5e", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  btnHeaderText:   { fontSize: 12, color: "#1a3c5e", fontWeight: "600" },

  searchRow:       { flexDirection: "row", gap: 8, marginBottom: 10 },
  input:           { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, padding: 11, fontSize: 14 },
  btnSearch:       { backgroundColor: "#1a3c5e", borderRadius: 8, paddingHorizontal: 16, justifyContent: "center" },
  btnSearchText:   { color: "#fff", fontWeight: "600", fontSize: 13 },

  btnAdd:          { borderWidth: 1, borderColor: "#1a3c5e", borderRadius: 8, padding: 11, alignItems: "center", marginBottom: 14 },
  btnAddText:      { color: "#1a3c5e", fontWeight: "600", fontSize: 14 },

  card:            { backgroundColor: "#fff", borderRadius: 8, marginBottom: 14, borderWidth: 1, borderColor: "#e0e0e0", overflow: "hidden" },
  image:           { width: "100%", height: 160, backgroundColor: "#f0f0f0" },
  imagePlaceholder:{ width: "100%", height: 100, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#999", fontSize: 13 },

  info:            { padding: 12 },
  name:            { fontSize: 16, fontWeight: "700", color: "#222", marginBottom: 4 },
  detail:          { fontSize: 13, color: "#666", marginBottom: 2 },

  buttons:         { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e0e0e0" },
  btnView:         { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#1a3c5e" },
  btnViewText:     { color: "#fff", fontWeight: "700", fontSize: 14 },
  btnDelete:       { flex: 1, padding: 12, alignItems: "center", borderLeftWidth: 1, borderLeftColor: "#e0e0e0" },
  btnDeleteText:   { color: "#c0392b", fontWeight: "700", fontSize: 14 },

  empty:           { textAlign: "center", color: "#999", marginTop: 40 },
});
