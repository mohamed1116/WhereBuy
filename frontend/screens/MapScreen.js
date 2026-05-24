import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

export default function MapScreen() {
  const lienCarte = "https://www.google.com/maps/place/Taroudant,+Maroc/@30.4727,-8.8746,14z";

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe src={lienCarte} style={{ width: "100%", height: "100%", border: "none" }} title="Carte" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ uri: lienCarte }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
});