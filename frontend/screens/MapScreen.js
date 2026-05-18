import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

function buildHTML(lat, lng, title) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style> body { margin: 0; } #map { width: 100vw; height: 100vh; } </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${lat}, ${lng}], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap' }).addTo(map);
    L.marker([${lat}, ${lng}]).addTo(map).bindPopup('${title}').openPopup();
  </script>
</body>
</html>`;
}

export default function MapScreen({ route }) {
  const lat   = route.params?.latitude  ?? 30.4727;
  const lng   = route.params?.longitude ?? -8.8746;
  const title = route.params?.adresse   ?? "Taroudant";

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe title="carte" src={"https://www.google.com/maps/search/" + encodeURIComponent(title + " Taroudant Maroc")} style={{ flex: 1, width: "100%", height: "100%", border: "none" }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ html: buildHTML(lat, lng, title) }} style={{ flex: 1 }} javaScriptEnabled />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
});
