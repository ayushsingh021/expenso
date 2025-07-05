import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";

const Home = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
      <Button onPress={handleLogout}>
        <Typo>Logout</Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
