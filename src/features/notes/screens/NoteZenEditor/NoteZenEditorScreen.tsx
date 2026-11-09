// NoteZenEditor/NoteZenEditorScreen.tsx
import { Colors } from "@/constants/colors";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useConfirmStore } from "@/store/useConfirmStore";
import { useState } from "react";
import { NoteAudioPlayerBubble } from "../../components/NoteAudioPlayerBubble";
import { AmbientModal } from "./components/AmbientModal";
import { AmbientPlayingBar } from "./components/AmbientPlayingBar";
import { NoteZenEmojiPanel } from "./components/NoteZenEmojiPanel";
import { NoteZenFloatingToolbar } from "./components/NoteZenFloatingToolbar";
import { NoteZenHeader } from "./components/NoteZenHeader";
import { NoteZenTodoPanel } from "./components/NoteZenTodoPanel";
import { useAmbientSound } from "./hooks/useAmbientSound";
import { useZenEditor } from "./hooks/useZenEditor";
import { styles } from "./NoteZenEditor.styles";

export function NoteZenEditorScreen() {
  const insets = useSafeAreaInsets();
  const {
    content,
    setContent,
    setSelection,
    isToolsOpen,
    setIsToolsOpen,
    activeWorkspace,
    wordCount,
    readingTime,
    doneCount,
    isRecording,
    recordedAudioUri,
    setRecordedAudioUri,
    todos,
    setTodos,
    isTodoPanelOpen,
    isTodoPanelMinimized,
    newTodoText,
    setNewTodoText,
    isEmojiPanelOpen,
    isEmojiPanelMinimized,
    bubbleAnims,
    mainRotate,
    handleInsertTimestamp,
    handleInsertBullet,
    handleInsertEmoji,
    handleToggleVoiceRecord,
    handleTransferAndExit,
    setIsTodoPanelOpen,
    setIsTodoPanelMinimized,
    setIsEmojiPanelOpen,
    setIsEmojiPanelMinimized,
  } = useZenEditor();

  const { showConfirm } = useConfirmStore();

  // Ambiyans Modalının Açık/Kapalı Durumu
  const [isAmbientModalVisible, setIsAmbientModalVisible] = useState(false);
  const {
    currentSoundKey,
    isPlaying,
    playAmbient,
    stopAmbient,
    togglePlayPause,
  } = useAmbientSound();

  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

  const handleToggleTodoPanel = () => {
    if (isTodoPanelOpen && isTodoPanelMinimized) setIsTodoPanelMinimized(false);
    else setIsTodoPanelOpen(!isTodoPanelOpen);
    setIsToolsOpen(false);
  };

  const handleToggleEmojiPanel = () => {
    if (isEmojiPanelOpen && isEmojiPanelMinimized)
      setIsEmojiPanelMinimized(false);
    else setIsEmojiPanelOpen(!isEmojiPanelOpen);
    setIsToolsOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom },
      ]}
    >
      {/* Üst Header */}
      <NoteZenHeader
        wordCount={wordCount}
        readingTime={readingTime}
        isRecording={isRecording}
        currentPrimaryColor={currentPrimaryColor}
        handleTransferAndExit={handleTransferAndExit}
        styles={styles}
      />

      {/* 🔥 2. SES ÇALARKEN EKRANIN ALTINDA ÇIKACAK MİNİ BİLGİ ETİKETİ */}
      <AmbientPlayingBar
        currentSoundKey={currentSoundKey}
        isPlaying={isPlaying}
        onTogglePlayPause={togglePlayPause}
        onStop={stopAmbient}
      />

      {/* Ekli Sesli Not Önizlemesi */}
      {recordedAudioUri && (
        <NoteAudioPlayerBubble
          uri={recordedAudioUri}
          primaryColor={currentPrimaryColor}
          labelTitle="Sesli Not (Ekli)"
          onDelete={() => {
            showConfirm({
              title: "Ses Kaydını Kaldır",
              message:
                "Ekli olan bu ses kaydını silmek istediğinden emin misin?",
              onConfirm: () => setRecordedAudioUri(null),
            });
          }}
        />
      )}

      {/* Yapılacaklar Paneli */}
      <NoteZenTodoPanel
        isTodoPanelOpen={isTodoPanelOpen}
        isTodoPanelMinimized={isTodoPanelMinimized}
        todos={todos}
        doneCount={doneCount}
        newTodoText={newTodoText}
        setNewTodoText={setNewTodoText}
        currentPrimaryColor={currentPrimaryColor}
        handleMinimizeTodoPanel={() => setIsTodoPanelMinimized(true)}
        handleCloseTodoPanel={() => {
          if (todos.length === 0) {
            setIsTodoPanelOpen(false);
            setIsTodoPanelMinimized(false);
            return;
          }
          showConfirm({
            title: "Listeyi Temizle & Kapat",
            message:
              "Yapılacaklar listesini kapatmak istiyor musun? Listedeki tüm maddeler silinecek.",
            confirmText: "Evet, Temizle",
            onConfirm: () => {
              setTodos([]);
              setIsTodoPanelOpen(false);
              setIsTodoPanelMinimized(false);
            },
          });
        }}
        handleRestoreTodoPanel={() => setIsTodoPanelMinimized(false)}
        handleAddTodo={() => {
          if (!newTodoText.trim()) return;
          setTodos((prev: any) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: newTodoText.trim(),
              done: false,
            },
          ]);
          setNewTodoText("");
        }}
        handleToggleTodo={(id) =>
          setTodos((prev: any) =>
            prev.map((t: any) => (t.id === id ? { ...t, done: !t.done } : t)),
          )
        }
        handleDeleteTodo={(id) => {
          const targetTodo = todos.find((t) => t.id === id);
          showConfirm({
            title: "Maddeyi Sil",
            message: `"${targetTodo?.text || "Bu maddeyi"}" silmek istiyor musun?`,
            onConfirm: () => {
              setTodos((prev: any) => prev.filter((t: any) => t.id !== id));
            },
          });
        }}
        styles={styles}
      />

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

      {/* Emoji Paneli */}
      <NoteZenEmojiPanel
        isEmojiPanelOpen={isEmojiPanelOpen}
        isEmojiPanelMinimized={isEmojiPanelMinimized}
        currentPrimaryColor={currentPrimaryColor}
        handleMinimizeEmojiPanel={() => setIsEmojiPanelMinimized(true)}
        handleCloseEmojiPanel={() => setIsEmojiPanelOpen(false)}
        handleRestoreEmojiPanel={() => setIsEmojiPanelMinimized(false)}
        handleInsertEmoji={handleInsertEmoji}
        styles={styles}
      />

      {/* İzole Edilmiş Floating Toolbar */}
      <NoteZenFloatingToolbar
        isToolsOpen={isToolsOpen}
        setIsToolsOpen={(open) => {
          if (open && isEmojiPanelOpen) setIsEmojiPanelMinimized(true);
          setIsToolsOpen(open);
        }}
        isRecording={isRecording}
        currentPrimaryColor={currentPrimaryColor}
        bubbleAnims={bubbleAnims}
        mainRotate={mainRotate}
        handleToggleTodoPanel={handleToggleTodoPanel}
        handleInsertTimestamp={handleInsertTimestamp}
        handleToggleEmojiPanel={handleToggleEmojiPanel}
        handleInsertBullet={handleInsertBullet}
        handleToggleVoiceRecord={handleToggleVoiceRecord}
        handleOpenAmbientModal={() => setIsAmbientModalVisible(true)}
        styles={styles}
      />

      {/* 🔥 1. SPARKLES'A BASINCA AÇILACAK AMBİYANS MODALI */}
      <AmbientModal
        visible={isAmbientModalVisible}
        onClose={() => setIsAmbientModalVisible(false)}
        onSelectSound={(key) => playAmbient(key)}
        currentSoundKey={currentSoundKey}
        onStop={stopAmbient}
      />
    </KeyboardAvoidingView>
  );
}
