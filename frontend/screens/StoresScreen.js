import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import axios from "axios";

const URL = "http://192.168.4.103:3000";

export default function StoresScreen({ route, navigation }) {
  const { product, user } = route.params;
  const [stores, setStores] = useState([]);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const res = await axios.get(URL + "/stores/" + product.id);
      setStores(res.data);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les magasins.");
    }
  }

  async function rateStore(storeId, rating) {
    try {
      const res = await axios.put(URL + "/stores/" + storeId + "/rate", { rating });
      setStores(prev => prev.map(s => s.id === storeId ? res.data : s));
    } catch {
      Alert.alert("Erreur", "Impossible d'envoyer la note.");
    }
  }

  async function addFavorite(store) {
    try {
      await axios.post(URL + "/favorites", { userId: user.id, storeId: store.id, storeName: store.name });
      Alert.alert("Succès", store.name + " ajouté aux favoris.");
    } catch (err) {
      Alert.alert("Info", err.response?.data?.error || "Erreur");
    }
  }

  return (
    <ScrollView style={styles.container}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Pas d'image</Text>
        </View>
      )}

      <View style={styles.bloc}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.storeName && <Text style={styles.line}>Magasin : {product.storeName}</Text>}
        {product.storeAddress && <Text style={styles.line}>Adresse : {product.storeAddress}</Text>}
        {product.info && <Text style={styles.line}>{product.info}</Text>}
      </View>

      <Text style={styles.subtitle}>Magasins disponibles</Text>

      {stores.length === 0 ? (
        <Text style={styles.empty}>Aucun magasin pour ce produit.</Text>
      ) : (
        stores.map(item => (
          <View key={item.id.toString()} style={styles.card}>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.storeInfo}>Adresse : {item.address}</Text>
            <Text style={styles.storeInfo}>Tel : {item.phone}</Text>
            <Text style={styles.storeRating}>Note : {item.rating} / 5  ({item.ratings.length} avis)</Text>

            <Text style={styles.ratingLabel}>Donner une note :</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity key={n} onPress={() => rateStore(item.id, n)}>
                  <Text style={styles.star}>{n <= Math.round(item.rating) ? "★" : "☆"}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.btnFav} onPress={() => addFavorite(item)}>
              <Text style={styles.btnFavText}>Ajouter aux favoris</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnAddStore} onPress={() => navigation.navigate("AddStore", { product, user })}>
              <Text style={styles.btnAddStoreText}>+ Ajouter un magasin</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: "#f5f5f5" },
  image:            { width: "100%", height: 220, backgroundColor: "#f0f0f0" },
  imagePlaceholder: { width: "100%", height: 120, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" },
  placeholderText:  { color: "#999", fontSize: 13 },
  bloc:             { backgroundColor: "#fff", padding: 16 },
  productName:      { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 8 },
  line:             { fontSize: 14, color: "#555", marginBottom: 4 },
  subtitle:         { fontSize: 14, fontWeight: "700", color: "#222", paddingHorizontal: 16, marginBottom: 8 },
  card:             { backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: "#e0e0e0" },
  storeName:        { fontSize: 15, fontWeight: "700", color: "#222", marginBottom: 6 },
  storeInfo:        { fontSize: 13, color: "#666", marginBottom: 2 },
  storeRating:      { fontSize: 13, color: "#1a3c5e", fontWeight: "600", marginTop: 6 },
  ratingLabel:      { fontSize: 13, color: "#666", marginTop: 10, marginBottom: 4 },
  stars:            { flexDirection: "row", gap: 4, marginBottom: 12 },
  star:             { fontSize: 26, color: "#e6a817" },
  btnFav:           { borderWidth: 1, borderColor: "#1a3c5e", borderRadius: 8, padding: 10, alignItems: "center" },
  btnFavText:       { color: "#1a3c5e", fontWeight: "600", fontSize: 13 },
  btnAddStore:      { backgroundColor: "#1a3c5e", marginTop: 12, borderRadius: 8, padding: 10, alignItems: "center" },
  btnAddStoreText:  { color: "#fff", fontWeight: "600", fontSize: 13 },
  empty:            { textAlign: "center", color: "#999", marginTop: 40 },
});