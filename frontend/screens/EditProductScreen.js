import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import axios from "axios";

const URL = "http://192.168.4.103:3000";

export default function EditProductScreen({ route, navigation }) {
  const [id]                          = useState(route.params.product.id);
  const [name, setName]               = useState(route.params.product.name         || "");
  const [image, setImage]             = useState(route.params.product.image        || "");
  const [storeName, setStoreName]     = useState(route.params.product.storeName    || "");
  const [storeAddress, setStoreAddress] = useState(route.params.product.storeAddress || "");
  const [info, setInfo]               = useState(route.params.product.info         || "");
  const [latitude, setLatitude]       = useState(route.params.product.latitude     || null);
  const [longitude, setLongitude]     = useState(route.params.product.longitude    || null);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (route.params.latitude && route.params.longitude) {
      setLatitude(route.params.latitude);
      setLongitude(route.params.longitude);
    }
  }, [route.params.latitude, route.params.longitude]);

  async function save() {
    if (!name.trim()) { Alert.alert("Erreur", "Le nom du produit est obligatoire."); return; }

    setLoading(true);
    try {
      await axios.put(URL + "/products/" + id, { name: name.trim(), image: image.trim(), storeName: storeName.trim(), storeAddress: storeAddress.trim(), info: info.trim(), latitude, longitude });
      Alert.alert("Succes", "Produit modifie !", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert("Erreur", "Impossible de modifier le produit.");
    }
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

      <Text style={styles.label}>Nom du produit *</Text>
      <TextInput style={styles.input} placeholder="Ex: Telephone, Livre, Velo..." value={name} onChangeText={setName} />

      <Text style={styles.label}>URL de l'image</Text>
      <TextInput style={styles.input} placeholder="https://exemple.com/image.png" value={image} onChangeText={setImage} autoCapitalize="none" autoCorrect={false} />
      {image.trim() ? (
        <Image source={{ uri: image.trim() }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.previewEmpty}>
          <Text style={styles.previewEmptyText}>L'image apparaitra ici apres avoir saisi l'URL</Text>
        </View>
      )}

      <Text style={styles.label}>Nom du magasin</Text>
      <TextInput style={styles.input} placeholder="Ex: Magasin Atlas" value={storeName} onChangeText={setStoreName} />

      <Text style={styles.label}>Adresse du magasin</Text>
      <TextInput style={styles.input} placeholder="Ex: Rue Hassan II, Taroudant" value={storeAddress} onChangeText={setStoreAddress} />

      <Text style={styles.label}>Localisation sur la carte</Text>
      {latitude && longitude ? (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>Position : {latitude.toFixed(5)}, {longitude.toFixed(5)}</Text>
          <TouchableOpacity style={styles.btnChange} onPress={() => navigation.navigate("PickLocation", { ecranRetour: "EditProduct", latitude, longitude })}>
            <Text style={styles.btnChangeText}>Changer la position</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.btnMap} onPress={() => navigation.navigate("PickLocation", { ecranRetour: "EditProduct", latitude: 30.4727, longitude: -8.8746 })}>
          <Text style={styles.btnMapText}>Choisir sur la carte</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Informations supplementaires</Text>
      <TextInput style={[styles.input, styles.inputTall]} placeholder="Ex: Ouvert de 9h a 18h..." value={info} onChangeText={setInfo} multiline />

      <TouchableOpacity style={styles.btn} onPress={save} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Enregistrement..." : "Enregistrer les modifications"}</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  label:          { fontSize: 13, color: "#555", marginBottom: 5, marginTop: 14 },
  input:          { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, padding: 11, fontSize: 14 },
  inputTall:      { height: 80, textAlignVertical: "top" },
  preview:        { width: "100%", height: 180, borderRadius: 8, marginTop: 8 },
  previewEmpty:   { width: "100%", height: 120, borderRadius: 8, marginTop: 8, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0" },
  previewEmptyText: { color: "#999", fontSize: 12, textAlign: "center", paddingHorizontal: 20 },
  btnMap:         { backgroundColor: "#fff", borderWidth: 1, borderColor: "#1a3c5e", borderRadius: 8, padding: 12, alignItems: "center", marginTop: 4 },
  btnMapText:     { color: "#1a3c5e", fontWeight: "600", fontSize: 14 },
  locationBox:    { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, padding: 12, marginTop: 4 },
  locationText:   { fontSize: 13, color: "#222", marginBottom: 8 },
  btnChange:      { borderWidth: 1, borderColor: "#1a3c5e", borderRadius: 6, padding: 8, alignItems: "center" },
  btnChangeText:  { color: "#1a3c5e", fontSize: 13, fontWeight: "600" },
  btn:            { backgroundColor: "#1a3c5e", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 24, marginBottom: 40 },
  btnText:        { color: "#fff", fontWeight: "700", fontSize: 15 },
});
