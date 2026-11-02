import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

interface NoteSwipeableItemProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void; // Sola kaydırınca (Kaldır)
  onSwipeRight?: () => void; // Sağa kaydırınca (Düzenle)

  leftActionText?: string;
  leftActionIcon?: keyof typeof Ionicons.glyphMap;
  leftActionColor?: string;

  rightActionText?: string;
  rightActionIcon?: keyof typeof Ionicons.glyphMap;
  rightActionColor?: string;

  threshold?: number;
}

export function NoteSwipeableItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftActionText = "Kaldır",
  leftActionIcon = "lock-open-outline",
  leftActionColor = "#ef4444",
  rightActionText = "Düzenle",
  rightActionIcon = "create-outline",
  rightActionColor = "#3b82f6",
  threshold = 120,
}: NoteSwipeableItemProps) {
  const panX = useRef(new Animated.Value(0)).current;

  const rightBackgroundOpacity = panX.interpolate({
    inputRange: [-120, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const leftBackgroundOpacity = panX.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderMove: (_, gestureState) => {
        panX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -threshold && onSwipeLeft) {
          Animated.timing(panX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeLeft();
            panX.setValue(0);
          });
        } else if (gestureState.dx > threshold && onSwipeRight) {
          Animated.timing(panX, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeRight();
            panX.setValue(0);
          });
        } else {
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.cardWrapper}>
      {/* 🔴 Sola çekilince sağ arkada görünen alan ("Kaldır") */}
      {onSwipeLeft && (
        <Animated.View
          style={[
            styles.actionBackground,
            styles.rightAction,
            {
              backgroundColor: leftActionColor,
              opacity: rightBackgroundOpacity,
            },
          ]}
        >
          <Text style={styles.actionText}>{leftActionText}</Text>
          <Ionicons name={leftActionIcon} size={22} color="#FFFFFF" />
        </Animated.View>
      )}

      {/* 🔵 Sağa çekilince sol arkada görünen alan ("Düzenle") */}
      {onSwipeRight && (
        <Animated.View
          style={[
            styles.actionBackground,
            styles.leftAction,
            {
              backgroundColor: rightActionColor,
              opacity: leftBackgroundOpacity,
            },
          ]}
        >
          <Ionicons name={rightActionIcon} size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>{rightActionText}</Text>
        </Animated.View>
      )}

      {/* Kaydırılabilir ön kart (İçeriğin yüksekliğini doğrudan alır) */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.animatedCardContainer,
          {
            transform: [{ translateX: panX }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: "relative",
    marginBottom: 12, // Kartlar arası boşluk sadece burada olmalı
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  actionBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 140,
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rightAction: {
    right: 0,
    justifyContent: "flex-end",
  },
  leftAction: {
    left: 0,
    justifyContent: "flex-start",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  animatedCardContainer: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // Kartın kendi arka planı ile çakışmaması için
  },
});
