import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TypoProps } from "@/types";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textTransform = "none",
  textProps = {},
}: TypoProps) => {
  const textStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
    textTransform
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
