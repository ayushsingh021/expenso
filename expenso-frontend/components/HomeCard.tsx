import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import * as Icons from "phosphor-react-native";
import { ImageBackground } from "expo-image";

const HomeCard = () => {
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* Total Balance Header */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight="500">
              Total Expense
            </Typo>
            <Icons.DotsThreeOutline
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.neutral500} size={12} fontWeight="500">
            In your local currency
          </Typo>

          {/* Balance Amount */}

          <Typo color={colors.black} size={30} fontWeight="bold">
            ₹2343
          </Typo>
        </View>
        <View style={styles.stats}>
          {/* income */}
          <View style={styles.incomeContainer}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.Coins
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>

              <Typo size={15} color={colors.neutral700} fontWeight={500}>
                INR -
              </Typo>
              <Typo size={15} color={colors.rose} fontWeight={600}>
                {"2342"}
              </Typo>
            </View>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.Coins
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>

              <Typo size={15} color={colors.neutral700} fontWeight={500}>
                USD -
              </Typo>
              <Typo size={15} color={colors.rose} fontWeight={600}>
                {"2342"}
              </Typo>
            </View>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.Coins
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>

              <Typo size={15} color={colors.neutral700} fontWeight={500}>
                ETH -
              </Typo>
              <Typo size={15} color={colors.rose} fontWeight={600}>
                {"2342"}
              </Typo>
            </View>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.Coins
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>

              <Typo size={15} color={colors.neutral700} fontWeight={500}>
                EUR -
              </Typo>
              <Typo size={15} color={colors.rose} fontWeight={600}>
                {"2342"}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._15,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  incomeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    gap: verticalScale(5),
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
