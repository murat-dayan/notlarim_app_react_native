import * as Location from "expo-location"; // 🔥 Eklendi
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

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
      setLatitude(null); // 🔥 Eklendi
      setLongitude(null); // 🔥 Eklendi

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
    setLatitude(existing.latitude ?? null); // 🔥 Eklendi
    setLongitude(existing.longitude ?? null); // 🔥 Eklendi

    initializedNoteId.current = id;
  }, [id, isLoading, existing]);

  // 🔥 Anlık Konum Alma Fonksiyonu
  const handleAddCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "İzin Reddedildi",
          "Konum ekleyebilmek için konum izni vermeniz gerekiyor.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      Alert.alert("Başarılı", "Mevcut konumun bu nota eklendi! 📍");
    } catch (error) {
      console.error("Konum alma hatası:", error);
      Alert.alert(
        "Hata",
        "Konum alınamadı, lütfen GPS ayarlarınızı kontrol edin.",
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  // 🔥 Konumu Kaldırma Fonksiyonu (Opsiyonel ama kullanışlı)
  const handleRemoveLocation = () => {
    setLatitude(null);
    setLongitude(null);
  };

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
      await updateNote(
        id,
        title,
        content,
        selectedTags,
        audioUri,
        todos,
        latitude,
        longitude,
      );
    } else {
      await addNote(
        title,
        content,
        selectedTags,
        audioUri,
        todos,
        latitude,
        longitude,
      );
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

    latitude,
    longitude,
    isGettingLocation,
    handleAddCurrentLocation,
    handleRemoveLocation,

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
