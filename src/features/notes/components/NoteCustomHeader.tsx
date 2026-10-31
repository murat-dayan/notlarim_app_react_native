import { Colors } from "@/constants/colors";
import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { NoteRoundIconButton } from "./NoteRoundIconButton";
import { NoteText } from "./NoteText";

type CustomHeaderProps = {
  title: string;
  onRightPress?: () => void;
  rightIcon?: React.ReactNode;
};

const ROPE_LENGTH = 44;

export function NoteCustomHeader({
  title,
  onRightPress,
  rightIcon,
}: CustomHeaderProps) {
  const swing = useRef(new Animated.Value(1)).current;
  const [groupHeight, setGroupHeight] = useState(0);

  // Açılışta levha sallanıp yavaşça duruyor
  useEffect(() => {
    Animated.spring(swing, {
      toValue: 0,
      friction: 1.4,
      tension: 20,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
      useNativeDriver: true,
    }).start();
  }, [swing]);

  const rotate = swing.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-7deg", "7deg"],
  });

  const onLayout = (e: LayoutChangeEvent) =>
    setGroupHeight(e.nativeEvent.layout.height);

  return (
    <View style={styles.headerContainer}>
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.hangingGroup,
          {
            // Dönüş merkezini ekranın en üstüne (ipin ucuna) taşıyan hile
            transform: [
              { translateY: -groupHeight / 2 },
              { rotate },
              { translateY: groupHeight / 2 },
            ],
          },
        ]}
      >
        {/* İpler */}
        <View style={[styles.rope, styles.ropeLeft]} />
        <View style={[styles.rope, styles.ropeRight]} />

        {/* Levha */}
        <View style={styles.board}>
          <View style={[styles.nail, styles.nailLeft]} />
          <View style={[styles.nail, styles.nailRight]} />

          {/* Seçenek 1: Dikiş çizgisi */}
          <View pointerEvents="none" style={styles.stitch} />

          {/* Sol Kısım: Özel Fontlu Büyük Başlık */}
          <View style={styles.titleContainer}>
            <NoteText
              variant="h1"
              fontFamily="BuildStorm"
              style={styles.titleText}
            >
              {title}
            </NoteText>
          </View>

          {/* Sağ Kısım */}
          {rightIcon && (
            <NoteRoundIconButton icon={rightIcon} onPress={onRightPress} />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.background,
    paddingBottom: 8,
  },
  hangingGroup: {
    // ipler en üstten başlasın diye üst boşluk yok
  },
  rope: {
    position: "absolute",
    top: 0,
    width: 2,
    height: ROPE_LENGTH + 6,
    backgroundColor: "#CBD5E1",
    borderRadius: 1,
  },
  ropeLeft: { left: 40 },
  ropeRight: { right: 40 },
  board: {
    marginTop: ROPE_LENGTH,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },
  nail: {
    position: "absolute",
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  nailLeft: { left: 20 },
  nailRight: { right: 20 },
  stitch: {
    position: "absolute",
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.primary + "55", // 6 haneli hex olmalı
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  titleText: {
    letterSpacing: -1,
    color: Colors.textMain,
  },
});
