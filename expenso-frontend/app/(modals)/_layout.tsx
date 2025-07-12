import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal", // ensures it's treated as modal
        animation: "slide_from_left", // iOS-style bottom-up animation
        gestureEnabled: true,
      }}
    />
  );
}
