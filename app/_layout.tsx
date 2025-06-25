import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b1c39' }}>
      <StatusBar style="light" backgroundColor="#0b1c39" />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0b1c39' },
          tabBarActiveTintColor: '#3399ff',
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            if (route.name === "index") {
              iconName = "cloud-upload-outline"; // Upload icon
            } else if (route.name === "gallery") {
              iconName = "images-outline"; // Gallery icon
            } else {
              iconName = "ellipse"; // default fallback
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Upload' }} />
        <Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
      </Tabs>

      {/* Flash message component */}
      <FlashMessage position="top" />
    </View>
  );
}
