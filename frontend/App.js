import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddStoreScreen from "./screens/AddStoreScreen";

import AuthScreen          from "./screens/AuthScreen";
import HomeScreen          from "./screens/HomeScreen";
import StoresScreen        from "./screens/StoresScreen";
import MapScreen           from "./screens/MapScreen";
import FavoritesScreen     from "./screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle:      { backgroundColor: "#1a3c5e" },
          headerTintColor:  "#ffffff",
          headerTitleStyle: { fontWeight: "600" }
        }}
      >
        <Stack.Screen name="Auth"         component={AuthScreen}         options={{ headerShown: false }} />
        <Stack.Screen name="Home"         component={HomeScreen}         options={{ title: "Wherebuy - Taroudant" }} />
        <Stack.Screen name="Stores"       component={StoresScreen}       options={function({ route }) { return { title: route.params.product.name }; }} />
        <Stack.Screen name="AddStore" component={AddStoreScreen} options={{ title: "Ajouter un magasin" }} />
        <Stack.Screen name="Map"          component={MapScreen}          options={{ title: "Carte" }} />
        <Stack.Screen name="Favorites"    component={FavoritesScreen}    options={{ title: "Mes Favoris" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
