import { Colors } from "@/constants/colors";
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotesStore } from "../store/useNotesStore";

const BUBBLE_COUNT = 7;

export function NoteZenEditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentContent } = useLocalSearchParams<{
    currentContent?: string;
  }>();

  const setZenDraftContent = useNotesStore((s) => s.setZenDraftContent);

  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);
  const workspaces = useNotesStore((s) => s.workspaces);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

  const [content, setContent] = useState(currentContent ?? "");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // 🌸 Her baloncuğun kendi animasyon değeri (sırayla açılması için)
  const bubbleAnims = useRef(
    Array.from({ length: BUBBLE_COUNT }, () => new Animated.Value(0)),
  ).current;
  const mainRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const opening = isToolsOpen;
    const ordered = opening ? bubbleAnims : [...bubbleAnims].reverse();

    Animated.parallel([
      // Ana buton ikonu döner
      Animated.spring(mainRotate, {
        toValue: opening ? 1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }),
      // Baloncuklar sırayla: açılırken zıplayarak, kapanırken hızlıca içeri
      Animated.stagger(
        opening ? 45 : 30,
        ordered.map((anim) =>
          Animated.spring(anim, {
            toValue: opening ? 1 : 0,
            useNativeDriver: true,
            tension: opening ? 140 : 180,
            friction: opening ? 5 : 10, // düşük friction = daha çok zıplama
            overshootClamping: !opening, // kapanırken taşma olmasın
          }),
        ),
      ),
    ]).start();
  }, [isToolsOpen]);

  const mainRotateDeg = mainRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Tarih Ekle
  const handleInsertTimestamp = () => {
    const timestamp = getCurrentFormattedTime();
    const formattedText = `${timestamp} — `;
    const { start, end } = selection;

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);

    setContent(newContent);
  };

  // Madde Ekle
  const handleInsertBullet = () => {
    const { start } = selection;
    const needsNewLine = start > 0 && content[start - 1] !== "\n";
    const bulletText = needsNewLine ? "\n• " : "• ";

    const newContent =
      content.substring(0, start) + bulletText + content.substring(start);

    setContent(newContent);
  };

  const handleTransferAndExit = () => {
    setZenDraftContent(content);
    router.back();
  };

  // 📐 Ana butona göre konumlar (x: sol = -, y: yukarı = -)
  const bubbles = [
    // DİKEY SIRA: x hep 0, ana butonun tam üstünde
    { key: "b3", icon: "bookmark-outline", x: 0, y: -60, onPress: () => {} },
    { key: "b1", icon: "sparkles-outline", x: 0, y: -140, onPress: () => {} },

    // YATAY SIRA: y hep 0, ana butonun tam solunda
    {
      key: "b7",
      icon: "time-outline",
      x: -60,
      y: 0,
      onPress: handleInsertTimestamp,
    },
    { key: "b6", icon: "happy-outline", x: -140, y: 0, onPress: () => {} },

    // İÇTEKİ SERBEST BALONCUKLAR
    {
      key: "b4",
      icon: "list-outline",
      x: -60,
      y: -60,
      onPress: handleInsertBullet,
    },
    { key: "b5", icon: "text-outline", x: -125, y: -65, onPress: () => {} },
    { key: "b2", icon: "flash-outline", x: -70, y: -125, onPress: () => {} },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <View style={styles.statsContainer}>
          <Text style={[styles.statText, { color: currentPrimaryColor }]}>
            {wordCount} kelime
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.statText, { color: currentPrimaryColor }]}>
            {readingTime} dk okuma
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.exitButton,
            { borderColor: currentPrimaryColor + "40" },
          ]}
          onPress={handleTransferAndExit}
          activeOpacity={0.7}
        >
          <Ionicons
            name="checkmark-outline"
            size={16}
            color={currentPrimaryColor}
          />
          <Text style={[styles.exitText, { color: currentPrimaryColor }]}>
            Aktar & Dön
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ana Yazı Alanı */}
      <View style={styles.editorWrapper}>
        <TextInput
          style={styles.contentInput}
          placeholder="Zihnindekileri akışa bırak..."
          placeholderTextColor={Colors.textMuted}
          value={content}
          onChangeText={setContent}
          onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
          multiline
          autoFocus
          textAlignVertical="top"
        />
      </View>

      {/* Araçlar */}
      <View
        style={[
          styles.toolbarContainer,
          { borderColor: currentPrimaryColor + "30" },
        ]}
      >
        {bubbles.map((b, i) => {
          const anim = bubbleAnims[i];
          return (
            <Animated.View
              key={b.key}
              style={[
                styles.floatingBubble,
                {
                  borderColor: currentPrimaryColor + "40",
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
                  color={currentPrimaryColor}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Ana Araçlar İkonu (Tetikleyici) */}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "50",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  dot: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  exitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  exitText: {
    fontSize: 12,
    fontWeight: "600",
  },
  editorWrapper: {
    flex: 1,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: Colors.textMain,
    padding: 0,
  },
  toolbarContainer: {
    alignSelf: "flex-end",
    backgroundColor: Colors.card,
    borderRadius: 28,
    borderWidth: 1,
    padding: 8,
    marginBottom: 32, // alttaki baloncuklar ekran dışına taşmasın
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
  },
  mainToolButton: {
    padding: 10,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBubble: {
    position: "absolute",
    right: 8, // ana butonla tam üst üste otursun
    bottom: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.card,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  bubbleInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
