import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuthStore } from "@/store/authStore";

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize(); // Trigger auto-login on app launch
  }, []);

  return <StackLayout />;
}

const styles = StyleSheet.create({});
