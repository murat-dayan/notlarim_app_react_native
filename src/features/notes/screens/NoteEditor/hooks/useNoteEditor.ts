import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useNotes } from "../../../store/hooks/useNotes";
import { TodoItem } from "../../../types";

export function useNoteEditor() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    addNote,
    updateNote,
    isLoading,
    activeWorkspaceId,
    workspaces,
    zenDraftContent,
    zenDraftTodos,
    zenDraftAudioUri,
    setZenDraftContent,
    notes,
  } = useNotes();

  const existing = notes.find((note) => note.id === id);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  // Özel etiket state'leri
  const [customTagInput, setCustomTagInput] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Formun aynı not için tekrar başlatılmasını engeller
  const initializedNoteId = useRef<string | null>(null);

  useEffect(() => {
    // Yeni not oluşturma ekranı
    if (!id) {
      initializedNoteId.current = null;

      setTitle("");
      setContent("");
      setSelectedTags([]);
      setAudioUri(null);
      setTodos([]);

      return;
    }

    // Notlar henüz yüklenmediyse bekle
    if (isLoading || !existing) return;

    // Bu notun formu zaten başlatılmışsa tekrar doldurma
    if (initializedNoteId.current === id) return;

    setTitle(existing.title);
    setContent(existing.content);
    setSelectedTags(existing.tags ?? []);
    setAudioUri(existing.audioUri ?? null);
    setTodos(existing.todos ?? []);

    initializedNoteId.current = id;
  }, [id, isLoading, existing]);

  // Etiket seçme / kaldırma
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  // Özel etiket ekleme
  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();

    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
    }

    setCustomTagInput("");
    setIsAddingCustom(false);
  };

  // Notu kaydetme
  const handleSave = async () => {
    if (id && (isLoading || !existing)) {
      Alert.alert("Not bulunamadı", "Düzenlemek istediğin nota ulaşılamıyor.");
      return;
    }

    if (!title.trim() && !content.trim() && !audioUri && todos.length === 0) {
      router.back();
      return;
    }

    if (id) {
      await updateNote(id, title, content, selectedTags, audioUri, todos);
    } else {
      await addNote(title, content, selectedTags, audioUri, todos);
    }

    router.back();
  };

  // Madde ekleme
  const handleAddBullet = () => {
    const bulletPrefix =
      content.length > 0 && !content.endsWith("\n") ? "\n• " : "• ";

    setContent((prev) => prev + bulletPrefix);
  };

  // Todo tamamlanma durumunu değiştirme
  const handleToggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  // Zen Editor'den dönünce taslakları uygula
  useFocusEffect(
    useCallback(() => {
      if (zenDraftContent !== null && zenDraftContent !== undefined) {
        setContent(zenDraftContent);

        if (zenDraftAudioUri !== undefined) {
          setAudioUri(zenDraftAudioUri);
        }

        if (zenDraftTodos !== undefined && zenDraftTodos !== null) {
          setTodos(zenDraftTodos);
        }

        setZenDraftContent(null, null, null);
      }
    }, [zenDraftContent, zenDraftAudioUri, zenDraftTodos, setZenDraftContent]),
  );

  const characterCount = content.length;
  const doneCount = todos.filter((todo) => todo.done).length;

  return {
    id,
    existing,
    isLoading,

    activeWorkspaceId,
    workspaces,

    title,
    setTitle,
    content,
    setContent,
    selectedTags,
    audioUri,
    todos,

    customTagInput,
    setCustomTagInput,
    isAddingCustom,
    setIsAddingCustom,

    toggleTag,
    handleAddCustomTag,
    handleSave,
    handleAddBullet,
    handleToggleTodo,

    characterCount,
    doneCount,
  };
}
