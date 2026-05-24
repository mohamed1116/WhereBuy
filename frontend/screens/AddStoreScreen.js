import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const URL = "http://localhost:3000"; // نفس الـ URL المستخدم في الملفات الأخرى

export default function AddStoreScreen({ route, navigation }) {
  const { product, user } = route.params;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveStore() {
    if (!name || !address || !phone) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }
    setLoading(true);
    try {
      await axios.post(URL + "/stores", { productId: product.id, name, address, phone, userId: user.id });
      Alert.alert("Succès", "Magasin ajouté !", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert("Erreur", "Impossible d'ajouter le magasin.");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du magasin</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Magasin Atlas" />

      <Text style={styles.label}>Adresse</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rue, quartier, Taroudant" />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Numéro de téléphone" keyboardType="phone-pad" />

      <TouchableOpacity style={styles.btn} onPress={saveStore} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Enregistrement..." : "Ajouter le magasin"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 14 },
  btn: { backgroundColor: "#1a3c5e", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 30 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});