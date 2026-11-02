import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeComplete: () => void;
  actionText?: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  actionColor?: string;
  threshold?: number;
  direction?: "left" | "right"; // 🔥 Yön parametresi eklendi
}

export function NoteSwipeableItem({
  children,
  onSwipeComplete,
  actionText = "Kilidi Aç",
  actionIcon = "lock-open-outline",
  actionColor = "#10b981",
  threshold = 120,
  direction = "left", // Varsayılan olarak sola kaydırma
}: SwipeableItemProps) {
  const panX = useRef(new Animated.Value(0)).current;
  const isLeft = direction === "left";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontal =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        // Sola mı yoksa sağa mı çekildiğini kontrol et
        return (
          isHorizontal &&
          (isLeft ? gestureState.dx < -10 : gestureState.dx > 10)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (isLeft && gestureState.dx < 0) {
          panX.setValue(gestureState.dx); // Sola doğru negatif değer alır
        } else if (!isLeft && gestureState.dx > 0) {
          panX.setValue(gestureState.dx); // Sağa doğru pozitif değer alır
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const triggered = isLeft
          ? gestureState.dx < -threshold
          : gestureState.dx > threshold;

        if (triggered) {
          Animated.timing(panX, {
            toValue: isLeft ? -400 : 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeComplete();
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
      {/* Arkada görünecek aksiyon arka planı (Yöne göre sağda veya solda konumlanır) */}
      <View
        style={[
          styles.hiddenActionBackground,
          { backgroundColor: actionColor },
          isLeft
            ? { right: 0, justifyContent: "flex-end", paddingRight: 20 }
            : { left: 0, justifyContent: "flex-start", paddingLeft: 20 },
        ]}
      >
        {isLeft ? (
          <>
            <Text style={styles.actionText}>{actionText}</Text>
            <Ionicons name={actionIcon} size={22} color="#FFFFFF" />
          </>
        ) : (
          <>
            <Ionicons name={actionIcon} size={22} color="#FFFFFF" />
            <Text style={styles.actionText}>{actionText}</Text>
          </>
        )}
      </View>

      {/* Kaydırılabilir ön içerik */}
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
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  hiddenActionBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 140,
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  animatedCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
});
