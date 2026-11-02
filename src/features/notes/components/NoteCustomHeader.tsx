import { Colors } from "@/constants/colors";
import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useNotesStore } from "../store/useNotesStore";
import { NoteRoundIconButton } from "./NoteRoundIconButton";
import { NoteText } from "./NoteText";

type CustomHeaderProps = {
  title: string;
  onRightPress?: () => void;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  leftIcon?: React.ReactNode;
};

const ROPE_LENGTH = 44;

export function NoteCustomHeader({
  title,
  onRightPress,
  rightIcon,
  onLeftPress,
  leftIcon,
}: CustomHeaderProps) {
  // 🔥 Aktif çalışma alanının rengini store'dan alıyoruz
  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);
  const workspaces = useNotesStore((s) => s.workspaces);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

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
        <View
          style={[
            styles.board,
            {
              borderColor: currentPrimaryColor + "40",
              shadowColor: currentPrimaryColor,
            },
          ]}
        >
          <View
            style={[
              styles.nail,
              styles.nailLeft,
              {
                backgroundColor: currentPrimaryColor,
                borderColor: Colors.border,
              },
            ]}
          />
          <View
            style={[
              styles.nail,
              styles.nailRight,
              {
                backgroundColor: currentPrimaryColor,
                borderColor: Colors.border,
              },
            ]}
          />

          {/* Dikiş çizgisi */}
          <View
            pointerEvents="none"
            style={[styles.stitch, { borderColor: currentPrimaryColor + "55" }]}
          />

          {/* Sol İkon (Varsa görünür) */}
          <View style={styles.leftContainer}>
            {leftIcon && (
              <NoteRoundIconButton icon={leftIcon} onPress={onLeftPress} />
            )}
          </View>

          {/* Orta Başlık (Her zaman tam ortadadır) */}
          <View style={styles.titleContainer}>
            <NoteText
              variant="h1"
              fontFamily="BuildStorm"
              style={[styles.titleText, { color: currentPrimaryColor }]}
              numberOfLines={1}
            >
              {title}
            </NoteText>
          </View>

          {/* Sağ İkon (Varsa görünür) */}
          <View style={styles.rightContainer}>
            {rightIcon && (
              <NoteRoundIconButton
                icon={rightIcon}
                onPress={onRightPress}
                style={{ backgroundColor: currentPrimaryColor }}
              />
            )}
          </View>
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
  hangingGroup: {},
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderRadius: 24,
    borderWidth: 1.5,
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
    borderWidth: 2,
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
  },
  leftContainer: {
    minWidth: 40,
    alignItems: "flex-start",
    zIndex: 2,
  },
  rightContainer: {
    minWidth: 40,
    alignItems: "flex-end",
    zIndex: 2,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  titleText: {
    letterSpacing: -1,
    textAlign: "center",
  },
});
