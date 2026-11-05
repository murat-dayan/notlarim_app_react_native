import { Colors } from "@/constants/colors";
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteAudioPlayerBubble } from "../components/NoteAudioPlayerBubble"; // 🔥 Zen modda dinlemek için
import { useNotesStore } from "../store/useNotesStore";
import { TodoItem } from "../types";

const BUBBLE_COUNT = 7;

export function NoteZenEditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentContent, currentTodos, currentAudioUri } =
    useLocalSearchParams<{
      currentContent?: string;
      currentTodos?: string;
      currentAudioUri?: string;
    }>();

  const setZenDraftContent = useNotesStore((s) => s.setZenDraftContent);

  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);
  const workspaces = useNotesStore((s) => s.workspaces);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

  const [content, setContent] = useState(currentContent ?? "");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // 🎙️ Ses Kayıt State'leri (expo-audio)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(
    currentAudioUri && currentAudioUri.trim() !== "" ? currentAudioUri : null,
  );

  // 🌸 Her baloncuğun kendi animasyon değeri
  const bubbleAnims = useRef(
    Array.from({ length: BUBBLE_COUNT }, () => new Animated.Value(0)),
  ).current;
  const mainRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const opening = isToolsOpen;
    const ordered = opening ? bubbleAnims : [...bubbleAnims].reverse();

    Animated.parallel([
      Animated.spring(mainRotate, {
        toValue: opening ? 1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }),
      Animated.stagger(
        opening ? 45 : 30,
        ordered.map((anim) =>
          Animated.spring(anim, {
            toValue: opening ? 1 : 0,
            useNativeDriver: true,
            tension: opening ? 140 : 180,
            friction: opening ? 5 : 10,
            overshootClamping: !opening,
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

  const QUICK_EMOJIS = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🔥",
    "🎯",
    "💡",
    "✅",
    "⭐",
    "🎉",
  ];

  const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
  const [isEmojiPanelMinimized, setIsEmojiPanelMinimized] = useState(false);

  // ✅ Yapılacaklar State'leri
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      return currentTodos ? JSON.parse(currentTodos) : [];
    } catch {
      return [];
    }
  });
  const [isTodoPanelOpen, setIsTodoPanelOpen] = useState(false);
  const [isTodoPanelMinimized, setIsTodoPanelMinimized] = useState(false); // 🆕 Yeni state
  const [newTodoText, setNewTodoText] = useState("");

  const doneCount = todos.filter((t) => t.done).length;

  // Emoji Ekle
  const handleInsertEmoji = (emoji: string) => {
    const { start, end } = selection;
    const newContent =
      content.substring(0, start) + emoji + content.substring(end);

    setContent(newContent);

    // Art arda eklemede imleç doğru yerde kalsın
    const newPos = start + emoji.length;
    setSelection({ start: newPos, end: newPos });
  };

  // Emoji panelini aç/kapat (küçültülmüşse geri açar)
  const handleToggleEmojiPanel = () => {
    if (isEmojiPanelOpen && isEmojiPanelMinimized) {
      setIsEmojiPanelMinimized(false);
    } else {
      setIsEmojiPanelOpen((prev) => !prev);
      setIsEmojiPanelMinimized(false);
    }
    setIsToolsOpen(false);
  };

  // Paneli tamamen kapat
  const handleCloseEmojiPanel = () => {
    setIsEmojiPanelOpen(false);
    setIsEmojiPanelMinimized(false);
  };

  // Yapılacaklar kartını aç/kapat (küçültülmüşse geri açar)
  const handleToggleTodoPanel = () => {
    if (isTodoPanelOpen && isTodoPanelMinimized) {
      setIsTodoPanelMinimized(false);
    } else {
      setIsTodoPanelOpen((prev) => !prev);
      setIsTodoPanelMinimized(false);
    }
    setIsToolsOpen(false);
  };

  // Yapılacaklar panelini tamamen kapat
  const handleCloseTodoPanel = () => {
    setIsTodoPanelOpen(false);
    setIsTodoPanelMinimized(false);
  };

  // Yapılacaklar panelini küçült (sol altta baloncuk olarak kalır)
  const handleMinimizeTodoPanel = () => {
    setIsTodoPanelMinimized(true);
  };

  // Küçültülmüş yapılacaklar panelini geri aç
  const handleRestoreTodoPanel = () => {
    setIsTodoPanelMinimized(false);
  };

  const handleAddTodo = () => {
    const text = newTodoText.trim();
    if (!text) return;

    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text, done: false },
    ]);
    setNewTodoText("");
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Paneli küçült (sol altta baloncuk olarak kalır)
  const handleMinimizeEmojiPanel = () => {
    setIsEmojiPanelMinimized(true);
  };

  // Küçültülmüş paneli geri aç
  const handleRestoreEmojiPanel = () => {
    setIsEmojiPanelMinimized(false);
  };

  // 🎙️ SES KAYDI BAŞLAT / DURDUR VE TEK KAYIT KONTROLÜ
  const handleToggleVoiceRecord = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        await audioRecorder.stop();
        const uri = audioRecorder.uri;

        if (uri) {
          const fileName = `voice_note_${Date.now()}.m4a`;
          const sourceFile = new File(uri);
          const destinationFile = new File(Paths.document, fileName);

          sourceFile.copy(destinationFile);
          setRecordedAudioUri(destinationFile.uri);
          // 🔥 Artık content içine çöp metin yazılmıyor!
        }
        setIsToolsOpen(false);
      } else {
        // 🔥 Zaten kayıtlı bir ses varsa ikinci kez kayda izin verme, uyar
        if (recordedAudioUri) {
          alert(
            "Zaten bir ses kaydı mevcut. Yeni kayıt eklemek için önce mevcut kaydı silmelisiniz.",
          );
          return;
        }

        const permission = await AudioModule.requestRecordingPermissionsAsync();
        if (!permission.granted) {
          alert("Ses kaydı için mikrofon izni gereklidir!");
          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Ses kaydı hatası:", err);
      setIsRecording(false);
    }
  };

  // 🔥 Kaydedilen sesi silme / iptal etme
  const handleDeleteRecordedAudio = () => {
    setRecordedAudioUri(null);
  };

  const handleTransferAndExit = () => {
    setZenDraftContent(content, recordedAudioUri, todos);
    router.back();
  };
  // Baloncuk Konumları
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

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Kayıt Alınıyor...</Text>
          </View>
        )}

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

      {/* 🔥 Zen Modda Kaydedilen Sesin Önizlemesi ve İptal Butonu */}
      {recordedAudioUri && (
        <View style={styles.zenAudioPreviewContainer}>
          <View style={styles.zenAudioHeader}>
            <Text style={styles.zenAudioTitle}>Sesli Not (Ekli)</Text>
            <TouchableOpacity
              onPress={handleDeleteRecordedAudio}
              style={styles.deleteAudioBtn}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={styles.deleteAudioText}>Kaldır</Text>
            </TouchableOpacity>
          </View>
          <NoteAudioPlayerBubble uri={recordedAudioUri} />
        </View>
      )}

      {/* ✅ Yapılacaklar Kartı */}
      {/* ✅ Yapılacaklar Kartı */}
      {isTodoPanelOpen && !isTodoPanelMinimized && (
        <View
          style={[styles.todoCard, { borderColor: currentPrimaryColor + "30" }]}
        >
          <View style={styles.todoHeader}>
            <Text style={[styles.todoTitle, { color: currentPrimaryColor }]}>
              Yapılacaklar
            </Text>
            <View style={styles.todoHeaderRight}>
              {todos.length > 0 && (
                <Text style={styles.todoCounter}>
                  {doneCount}/{todos.length} tamamlandı
                </Text>
              )}
              {/* 🔽 Küçültme Butonu */}
              <TouchableOpacity
                onPress={handleMinimizeTodoPanel}
                hitSlop={8}
                style={styles.todoHeaderBtn}
              >
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={currentPrimaryColor}
                />
              </TouchableOpacity>
              {/* ❌ Tamamen Kapatma Butonu */}
              <TouchableOpacity
                onPress={handleCloseTodoPanel}
                hitSlop={8}
                style={styles.todoHeaderBtn}
              >
                <Ionicons name="close" size={18} color={currentPrimaryColor} />
              </TouchableOpacity>
            </View>
          </View>

          {todos.length > 0 && (
            <ScrollView
              style={styles.todoList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {todos.map((todo) => (
                <View key={todo.id} style={styles.todoRow}>
                  <TouchableOpacity
                    onPress={() => handleToggleTodo(todo.id)}
                    hitSlop={8}
                    style={styles.todoCheck}
                  >
                    <Ionicons
                      name={todo.done ? "checkbox" : "square-outline"}
                      size={22}
                      color={todo.done ? currentPrimaryColor : Colors.textMuted}
                    />
                  </TouchableOpacity>

                  <Text
                    style={[styles.todoText, todo.done && styles.todoTextDone]}
                  >
                    {todo.text}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDeleteTodo(todo.id)}
                    hitSlop={~8}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={18}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.todoInputRow}>
            <TextInput
              style={styles.todoInput}
              placeholder="Yeni madde ekle..."
              placeholderTextColor={Colors.textMuted}
              value={newTodoText}
              onChangeText={setNewTodoText}
              onSubmitEditing={handleAddTodo}
              returnKeyType="done"
              submitBehavior="submit"
            />
            <TouchableOpacity
              onPress={handleAddTodo}
              style={[
                styles.todoAddBtn,
                { backgroundColor: currentPrimaryColor + "20" },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={currentPrimaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ✅ Küçültülmüş Yapılacaklar Baloncuğu */}
      {isTodoPanelOpen && isTodoPanelMinimized && (
        <TouchableOpacity
          onPress={handleRestoreTodoPanel}
          activeOpacity={0.7}
          style={[
            styles.minimizedTodoBubble,
            { borderColor: currentPrimaryColor + "40" },
          ]}
        >
          <Ionicons
            name="bookmark-outline"
            size={20}
            color={currentPrimaryColor}
          />
        </TouchableOpacity>
      )}

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

      {/* 😊 Mini Emoji Paneli */}
      {isEmojiPanelOpen && !isEmojiPanelMinimized && (
        <View
          style={[
            styles.emojiPanel,
            { borderColor: currentPrimaryColor + "30" },
          ]}
        >
          <View style={styles.emojiPanelHeader}>
            <TouchableOpacity
              onPress={handleMinimizeEmojiPanel}
              hitSlop={8}
              style={styles.emojiHeaderBtn}
            >
              <Ionicons
                name="chevron-down"
                size={18}
                color={currentPrimaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseEmojiPanel}
              hitSlop={8}
              style={styles.emojiHeaderBtn}
            >
              <Ionicons name="close" size={18} color={currentPrimaryColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.emojiGrid}>
            {QUICK_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleInsertEmoji(emoji)}
                style={styles.emojiButton}
                activeOpacity={0.6}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 😊 Küçültülmüş Emoji Baloncuğu */}
      {isEmojiPanelOpen && isEmojiPanelMinimized && (
        <TouchableOpacity
          onPress={handleRestoreEmojiPanel}
          activeOpacity={0.7}
          style={[
            styles.minimizedEmojiBubble,
            { borderColor: currentPrimaryColor + "40" },
          ]}
        >
          <Ionicons
            name="happy-outline"
            size={20}
            color={currentPrimaryColor}
          />
        </TouchableOpacity>
      )}

      {/* Araçlar */}
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

        {/* Ana Araçlar İkonu */}
        <TouchableOpacity
          style={[
            styles.mainToolButton,
            isToolsOpen && { backgroundColor: currentPrimaryColor + "15" },
          ]}
          onPress={() => {
            if (isEmojiPanelOpen) setIsEmojiPanelMinimized(true);
            setIsToolsOpen(!isToolsOpen);
          }}
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
    marginBottom: 12,
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
  todoHeaderBtn: {
    padding: 4,
  },
  minimizedTodoBubble: {
    position: "absolute",
    left: 80, // Emoji baloncuğunun (left: 24) hemen yanında konumlandırmak için
    bottom: 40,
    width: 44,
    height: 44,
    borderRadius: 22,
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
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffe6e6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4d4d",
  },
  recordingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ff4d4d",
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
  zenAudioPreviewContainer: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 10, // 🔥 Dokunmaların kesinlikle algılanması için en üst katman
    elevation: 5,
  },
  zenAudioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  zenAudioTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  deleteAudioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deleteAudioText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EF4444",
  },
  todoCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  todoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  todoTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  todoHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  todoCounter: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  todoList: {
    maxHeight: 150,
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
  },
  todoCheck: {
    padding: 2,
  },
  todoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
  },
  todoTextDone: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  todoInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  todoInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  todoAddBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
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

  emojiPanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  emojiPanelHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    paddingHorizontal: 6,
    paddingBottom: 2,
  },
  emojiHeaderBtn: {
    padding: 4,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  minimizedEmojiBubble: {
    position: "absolute",
    left: 24,
    bottom: 40,
    width: 44,
    height: 44,
    borderRadius: 22,
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
  emojiButton: {
    padding: 8,
  },
  emojiText: {
    fontSize: 22,
  },
  toolbarContainer: {
    alignSelf: "flex-end",
    backgroundColor: Colors.card,
    borderRadius: 28,
    borderWidth: 1,
    padding: 8,
    marginBottom: 32,
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
    right: 8,
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
