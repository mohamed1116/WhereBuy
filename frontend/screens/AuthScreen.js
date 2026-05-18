import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import axios from "axios";

const URL = "http://192.168.4.103:3000";

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!username || !password) {
      Alert.alert("Erreur", "Remplis tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const route = isLogin ? "/login" : "/register";
      const res = await axios.post(URL + route, { username, password });
      navigation.replace("Home", { user: res.data });
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.error || "Erreur reseau");
    }
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/684/684908.png" }} style={styles.logo} />
      <Text style={styles.titre}>Wherebuy</Text>
      <Text style={styles.sousTitre}>Trouvez où acheter à Taroudant</Text>

      <Text style={styles.label}>Nom d'utilisateur</Text>
      <TextInput style={styles.input} placeholder="username" value={username} onChangeText={setUsername} autoCapitalize="none" />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput style={styles.input} placeholder="password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnTexte}>{loading ? "Chargement..." : isLogin ? "Se connecter" : "Creer un compte"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.lien}>
        <Text style={styles.lienTexte}>{isLogin ? "Pas de compte ? S'inscrire" : "Deja un compte ? Se connecter"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f4f6f9", justifyContent: "center", padding: 24 },
  logo:      { width: 90, height: 90, alignSelf: "center", marginBottom: 16, borderRadius: 20 },
  titre:     { fontSize: 30, fontWeight: "700", color: "#1a3c5e", textAlign: "center" },
  sousTitre: { fontSize: 13, color: "#6b7c93", textAlign: "center", marginBottom: 36 },
  label:     { fontSize: 13, color: "#6b7c93", marginBottom: 5 },
  input:     { backgroundColor: "#fff", borderWidth: 1, borderColor: "#dde3ea", borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16 },
  btn:       { backgroundColor: "#1a3c5e", borderRadius: 8, padding: 14, alignItems: "center" },
  btnTexte:  { color: "#fff", fontWeight: "700", fontSize: 15 },
  lien:      { marginTop: 20, alignItems: "center" },
  lienTexte: { color: "#2d6a9f", fontSize: 13 },
});
