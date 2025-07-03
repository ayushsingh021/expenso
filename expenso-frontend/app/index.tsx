import { Image, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";

const SplashScreen = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasInitialized = useAuthStore((s) => s.hasInitialized);

  useEffect(() => {
    if (!hasInitialized) return;

    // Decide where to go
    if (user) {
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);
      // or your main app route
    } else {
      setTimeout(() => {
        router.replace("/(auth)/welcome");
      }, 2000);
      // login/signup flow
    }
  }, [hasInitialized]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/splashImage.png")}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
