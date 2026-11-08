// NoteZenEditor/hooks/useZenEditor.ts
import { useNotes } from "@/features/notes/store/hooks/useNotes";
import { TodoItem } from "@/features/notes/types";
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const BUBBLE_COUNT = 7;

export function useZenEditor() {
  const router = useRouter();
  const { currentContent, currentTodos, currentAudioUri } =
    useLocalSearchParams<{
      currentContent?: string;
      currentTodos?: string;
      currentAudioUri?: string;
    }>();

  const { setZenDraftContent, workspaces, activeWorkspaceId } = useNotes();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const [content, setContent] = useState(currentContent ?? "");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Ses Kayıt State'leri
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(
    currentAudioUri && currentAudioUri.trim() !== "" ? currentAudioUri : null,
  );

  // Todo State'leri
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      return currentTodos ? JSON.parse(currentTodos) : [];
    } catch {
      return [];
    }
  });
  const [isTodoPanelOpen, setIsTodoPanelOpen] = useState(
    () => todos.length > 0,
  );
  const [isTodoPanelMinimized, setIsTodoPanelMinimized] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");

  // Emoji State'leri
  const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
  const [isEmojiPanelMinimized, setIsEmojiPanelMinimized] = useState(false);

  // Animasyonlar
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

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const doneCount = todos.filter((t) => t.done).length;

  const handleInsertTimestamp = () => {
    const timestamp = getCurrentFormattedTime();
    const formattedText = `${timestamp} — `;
    const { start, end } = selection;
    setContent(
      content.substring(0, start) + formattedText + content.substring(end),
    );
  };

  const handleInsertBullet = () => {
    const { start } = selection;
    const needsNewLine = start > 0 && content[start - 1] !== "\n";
    const bulletText = needsNewLine ? "\n• " : "• ";
    setContent(
      content.substring(0, start) + bulletText + content.substring(start),
    );
  };

  const handleInsertEmoji = (emoji: string) => {
    const { start, end } = selection;
    const newContent =
      content.substring(0, start) + emoji + content.substring(end);
    setContent(newContent);
    const newPos = start + emoji.length;
    setSelection({ start: newPos, end: newPos });
  };

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
        }
        setIsToolsOpen(false);
      } else {
        if (recordedAudioUri) {
          alert("Zaten bir ses kaydı mevcut. Önce mevcut kaydı silmelisiniz.");
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

  const handleTransferAndExit = () => {
    setZenDraftContent(content, recordedAudioUri, todos);
    router.back();
  };

  return {
    content,
    setContent,
    selection,
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
    setTodos,
    setदेखना: setTodos,
  };
}
