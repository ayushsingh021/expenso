import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize(); // Trigger auto-login on app launch
  }, []);

  return <Slot />;
}

const styles = StyleSheet.create({});
