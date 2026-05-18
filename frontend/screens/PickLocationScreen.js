import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

function buildHTML(lat, lng) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; } #map { width: 100vw; height: 100vh; }
    #info { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px; font-family: sans-serif; z-index: 1000; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
  <div id="info">Appuyez sur la carte pour choisir un emplacement</div>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${lat}, ${lng}], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap' }).addTo(map);
    var marker = null;
    map.on('click', function(e) {
      if (marker) map.removeLayer(marker);
      marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      document.getElementById('info').innerText = 'Position : ' + e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5);
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: e.latlng.lat, longitude: e.latlng.lng }));
    });
  </script>
</body>
</html>`;
}

export default function PickLocationScreen({ route, navigation }) {
  const lat = route.params?.latitude  ?? 30.4727;
  const lng = route.params?.longitude ?? -8.8746;
  const [position, setPosition] = useState(null);

  function onMessage(event) {
    try { setPosition(JSON.parse(event.nativeEvent.data)); } catch {}
  }

  function confirm() {
    if (!position) return;
    navigation.navigate(route.params.ecranRetour, { latitude: position.latitude, longitude: position.longitude });
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.webMsg}>
        <Text style={styles.webMsgText}>La selection sur la carte est disponible uniquement sur l'application mobile.</Text>
        <Text style={styles.webMsgSub}>Sur le web, entrez l'adresse manuellement dans le champ "Adresse".</Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnBackText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ html: buildHTML(lat, lng) }} style={{ flex: 1 }} javaScriptEnabled onMessage={onMessage} />
      <View style={styles.bottomBar}>
        {position ? (
          <Text style={styles.coords}>Lat : {position.latitude.toFixed(5)}   Lng : {position.longitude.toFixed(5)}</Text>
        ) : (
          <Text style={styles.hint}>Appuyez sur la carte pour choisir</Text>
        )}
        <TouchableOpacity style={[styles.btnConfirm, !position && styles.btnDisabled]} onPress={confirm} disabled={!position}>
          <Text style={styles.btnConfirmText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  bottomBar:    { backgroundColor: "#fff", padding: 14, borderTopWidth: 1, borderTopColor: "#e0e0e0", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  coords:       { fontSize: 13, color: "#222", flex: 1 },
  hint:         { fontSize: 13, color: "#999", flex: 1 },
  btnConfirm:   { backgroundColor: "#1a3c5e", borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10 },
  btnConfirmText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  btnDisabled:  { backgroundColor: "#aaa" },
  webMsg:       { flex: 1, justifyContent: "center", alignItems: "center", padding: 30, backgroundColor: "#f5f5f5" },
  webMsgText:   { fontSize: 15, color: "#222", textAlign: "center", marginBottom: 10 },
  webMsgSub:    { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 30 },
  btnBack:      { backgroundColor: "#1a3c5e", borderRadius: 8, padding: 12, paddingHorizontal: 24 },
  btnBackText:  { color: "#fff", fontWeight: "600" },
});
