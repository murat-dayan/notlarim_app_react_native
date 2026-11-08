// NoteZenEditor/components/NoteZenFloatingToolbar.tsx
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Animated, TouchableOpacity, View } from "react-native";

type NoteZenFloatingToolbarProps = {
  isToolsOpen: boolean;
  setIsToolsOpen: (open: boolean) => void;
  isRecording: boolean;
  currentPrimaryColor: string;
  bubbleAnims: Animated.Value[];
  mainRotate: Animated.Value;
  handleToggleTodoPanel: () => void;
  handleInsertTimestamp: () => void;
  handleToggleEmojiPanel: () => void;
  handleInsertBullet: () => void;
  handleToggleVoiceRecord: () => void;
  styles: any;
};

export function NoteZenFloatingToolbar({
  isToolsOpen,
  setIsToolsOpen,
  isRecording,
  currentPrimaryColor,
  bubbleAnims,
  mainRotate,
  handleToggleTodoPanel,
  handleInsertTimestamp,
  handleToggleEmojiPanel,
  handleInsertBullet,
  handleToggleVoiceRecord,
  styles,
}: NoteZenFloatingToolbarProps) {
  const mainRotateDeg = mainRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const bubbles = [
    {
      key: "b3",
      icon: "bookmark-outline",
      x: 0,
      y: -60,
      onPress: handleToggleTodoPanel,
    },
    { key: "b1", icon: "sparkles-outline", x: 0, y: -140, onPress: () => {} },
    {
      key: "b7",
      icon: "time-outline",
      x: -60,
      y: 0,
      onPress: handleInsertTimestamp,
    },
    {
      key: "b6",
      icon: "happy-outline",
      x: -140,
      y: 0,
      onPress: handleToggleEmojiPanel,
    },
    {
      key: "b4",
      icon: "list-outline",
      x: -60,
      y: -60,
      onPress: handleInsertBullet,
    },
    { key: "b5", icon: "text-outline", x: -125, y: -65, onPress: () => {} },
    {
      key: "b2",
      icon: isRecording ? "stop" : "volume-high",
      x: -70,
      y: -125,
      onPress: handleToggleVoiceRecord,
    },
  ];

  return (
    <View
      style={[
        styles.toolbarContainer,
        { borderColor: currentPrimaryColor + "30" },
      ]}
    >
      {bubbles.map((b, i) => {
        const anim = bubbleAnims[i];
        const isMicButton = b.key === "b2";
        return (
          <Animated.View
            key={b.key}
            style={[
              styles.floatingBubble,
              {
                borderColor:
                  isRecording && isMicButton
                    ? "#ff4d4d"
                    : currentPrimaryColor + "40",
                backgroundColor:
                  isRecording && isMicButton ? "#ffe6e6" : Colors.card,
                opacity: anim.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 1, 1],
                  extrapolate: "clamp",
                }),
                transform: [
                  { translateX: Animated.multiply(anim, b.x) },
                  { translateY: Animated.multiply(anim, b.y) },
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                      extrapolateLeft: "clamp",
                    }),
                  },
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["-180deg", "0deg"],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents={isToolsOpen ? "auto" : "none"}
          >
            <TouchableOpacity onPress={b.onPress} style={styles.bubbleInner}>
              <Ionicons
                name={b.icon as any}
                size={20}
                color={
                  isRecording && isMicButton ? "#ff4d4d" : currentPrimaryColor
                }
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      <TouchableOpacity
        style={[
          styles.mainToolButton,
          isToolsOpen && { backgroundColor: currentPrimaryColor + "15" },
        ]}
        onPress={() => setIsToolsOpen(!isToolsOpen)}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ rotate: mainRotateDeg }] }}>
          <Ionicons
            name={isToolsOpen ? "close" : "options-outline"}
            size={22}
            color={currentPrimaryColor}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
