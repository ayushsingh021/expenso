import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";

const Home = () => {
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
