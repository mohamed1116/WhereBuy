import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const URL = "http://192.168.4.103:3000";

export default function FavoritesScreen({ route }) {
  const { user } = route.params;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => { loadFavorites(); }, []);

  async function loadFavorites() {
    try {
      const res = await axios.get(URL + "/favorites/" + user.id);
      setFavorites(res.data);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les favoris.");
    }
  }

  async function deleteFavorite(id) {
    try {
      await axios.delete(URL + "/favorites/" + id);
      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch {
      Alert.alert("Erreur", "Impossible de supprimer.");
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.storeName}</Text>
        <TouchableOpacity onPress={() =>
          Alert.alert("Supprimer", `Retirer "${item.storeName}" des favoris ?`, [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: () => deleteFavorite(item.id) }
          ])
        }>
          <Text style={styles.btnDelete}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Aucun favori enregistre.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  card:      { backgroundColor: "#fff", borderRadius: 8, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: "#e0e0e0", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name:      { fontSize: 15, fontWeight: "600", color: "#222", flex: 1 },
  btnDelete: { fontSize: 13, color: "#c0392b", fontWeight: "600" },
  empty:     { textAlign: "center", color: "#999", marginTop: 40 },
});
