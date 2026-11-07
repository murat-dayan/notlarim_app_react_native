import { Colors } from "@/constants/colors";
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteAudioPlayerBubble } from "../../components/NoteAudioPlayerBubble";
import { NoteCustomHeader } from "../../components/NoteCustomHeader";
import { NoteTextInput } from "../../components/NoteTextInput";
import { useNotes } from "../../store/hooks/useNotes";
import { useNotesStore } from "../../store/notesStore";
import { TodoItem } from "../../types";
import { styles } from "./NoteEditor.styles";
// 🔥 TodoItem tipini içeri aktarıyoruz

// Hazır popüler etiket seçenekleri
const PREDEFINED_TAGS = [
  "İş",
  "Kişisel",
  "Fikir",
  "Önemli",
  "Alışveriş",
  "Eğitim",
];

export function NoteEditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    addNote,
    updateNote,
    deleteNote,
    activeWorkspaceId,
    workspaces,
    zenDraftContent,
    zenDraftTodos,
    zenDraftAudioUri,
    setZenDraftContent,
  } = useNotes();

  const existing = useNotesStore((s) => s.notes.find((n) => n.id === id));

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");

  // Seçilen etiketleri dizi olarak tutuyoruz
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existing?.tags ?? [],
  );

  // Özel yeni etiket eklemek için input state'i
  const [customTagInput, setCustomTagInput] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const clearZenDraft = setZenDraftContent;

  const [audioUri, setAudioUri] = useState<string | null>(
    existing?.audioUri ?? null,
  );

  // ✅ Not ekranındaki Yapılacaklar State'i (Başlangıçta mevcut nottan veya boş dizi)
  const [todos, setTodos] = useState<TodoItem[]>(existing?.todos ?? []);

  // Etiket seçme / kaldırma mantığı
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Kullanıcının özel etiket eklemesi
  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setCustomTagInput("");
    setIsAddingCustom(false);
  };

  const handleSave = async () => {
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

  const handleDelete = () => {
    if (!id) return;
    Alert.alert("Notu sil", "Bu not kalıcı olarak silinecek.", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await deleteNote(id);
          router.back();
        },
      },
    ]);
  };

  const handleAddBullet = () => {
    const bulletPrefix =
      content.length > 0 && !content.endsWith("\n") ? "\n" : "• ";
    setContent(content + bulletPrefix);
  };

  // ✅ Sadece checkbox durumunu değiştiren fonksiyon (Not ekranında yeni madde eklenmez/silinmez)
  const handleToggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)),
    );
  };

  const characterCount = content.length;

  // 🔥 Zen modundan dönünce içerik, ses ve yapılacakları güncelleme
  // 🔥 Zen modundan dönünce içerik, ses ve yapılacakları güncelleme
  useFocusEffect(
    useCallback(() => {
      if (zenDraftContent !== null && zenDraftContent !== undefined) {
        setContent(zenDraftContent);
        if (zenDraftAudioUri !== undefined) {
          setAudioUri(zenDraftAudioUri);
        }
        if (zenDraftTodos !== undefined && zenDraftTodos !== null) {
          setTodos(zenDraftTodos); // 👈 null kontrolü eklendi
        }
        clearZenDraft(null, null, null); // Zen draft'ı temizle
      }
    }, [zenDraftContent, zenDraftAudioUri, zenDraftTodos]),
  );

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <NoteCustomHeader
        title={id ? "Notu düzenle" : "Yeni Not"}
        leftIcon={
          <Ionicons name="arrow-back" size={20} color={Colors.textMain} />
        }
        onLeftPress={router.back}
        rightIcon={
          <Ionicons name="save" size={20} color={Colors.textSecondary} />
        }
        onRightPress={handleSave}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NoteTextInput
          placeholder="Başlık"
          placeholderTextColor={currentPrimaryColor}
          label="Başlık Ekleyin"
          value={title}
          onChangeText={setTitle}
          activeColor={currentPrimaryColor}
        />

        {/* İnteraktif Etiket Seçim Alanı */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionLabel}>Etiketler</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {PREDEFINED_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    isSelected && [
                      styles.selectedTagChip,
                      {
                        backgroundColor: currentPrimaryColor,
                        borderColor: currentPrimaryColor,
                      },
                    ],
                  ]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected && styles.selectedTagText,
                    ]}
                  >
                    {tag} {isSelected ? "✓" : "+"}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Kullanıcının kendi özel etiketleri */}
            {selectedTags
              .filter((t) => !PREDEFINED_TAGS.includes(t))
              .map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    styles.selectedTagChip,
                    {
                      backgroundColor: currentPrimaryColor,
                      borderColor: currentPrimaryColor,
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagText, styles.selectedTagText]}>
                    {tag} ✓
                  </Text>
                </TouchableOpacity>
              ))}

            {/* Yeni Özel Etiket Ekleme Butonu / Inputu */}
            {isAddingCustom ? (
              <View
                style={[
                  styles.customTagInputContainer,
                  { borderColor: currentPrimaryColor },
                ]}
              >
                <TextInput
                  style={styles.customTagInput}
                  placeholder="Etiket adı..."
                  placeholderTextColor={Colors.textMuted}
                  value={customTagInput}
                  onChangeText={setCustomTagInput}
                  onSubmitEditing={handleAddCustomTag}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleAddCustomTag}
                  style={[
                    styles.addTagConfirmBtn,
                    { backgroundColor: currentPrimaryColor },
                  ]}
                >
                  <Text style={styles.addTagConfirmText}>Ekle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addTagChip}
                onPress={() => setIsAddingCustom(true)}
              >
                <Text style={styles.addTagText}>+ Yeni Etiket</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <View style={styles.editorContainer}>
          {/* Üst Kısım: Tarih ve Canlı Karakter Sayacı Rozeti */}
          <View style={styles.editorHeaderMeta}>
            <View
              style={[
                styles.metaBadge,
                { borderColor: currentPrimaryColor + "40" },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={13}
                color={currentPrimaryColor}
              />
              <Text style={[styles.metaText, { color: currentPrimaryColor }]}>
                {getCurrentFormattedTime()}
              </Text>
            </View>
            <View
              style={[
                styles.metaBadge,
                { borderColor: currentPrimaryColor + "40" },
              ]}
            >
              <Ionicons
                name="text-outline"
                size={13}
                color={currentPrimaryColor}
              />
              <Text style={[styles.metaText, { color: currentPrimaryColor }]}>
                {characterCount} karakter
              </Text>
            </View>
          </View>

          {/* ✅ Sadece Görüntülenebilir & Checkbox İşlevli Yapılacaklar Listesi */}
          {todos.length > 0 && (
            <View
              style={[
                styles.readOnlyTodoCard,
                { borderColor: currentPrimaryColor + "30" },
              ]}
            >
              <View style={styles.readOnlyTodoHeader}>
                <Text
                  style={[
                    styles.readOnlyTodoTitle,
                    { color: currentPrimaryColor },
                  ]}
                >
                  Yapılacaklar
                </Text>
                <Text style={styles.readOnlyTodoCounter}>
                  {doneCount}/{todos.length} tamamlandı
                </Text>
              </View>

              {todos.map((todo) => (
                <View key={todo.id} style={styles.readOnlyTodoRow}>
                  <TouchableOpacity
                    onPress={() => handleToggleTodo(todo.id)}
                    hitSlop={8}
                    style={styles.todoCheck}
                  >
                    <Ionicons
                      name={todo.done ? "checkbox" : "square-outline"}
                      size={20}
                      color={todo.done ? currentPrimaryColor : Colors.textMuted}
                    />
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.readOnlyTodoText,
                      todo.done && styles.readOnlyTodoTextDone,
                    ]}
                  >
                    {todo.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* 🎙️ SESLİ NOT BLOKU */}
          {audioUri && (
            <View style={styles.inlineAudioContainer}>
              <View style={styles.audioHeaderRow}>
                <Ionicons name="mic" size={14} color={currentPrimaryColor} />
                <Text
                  style={[
                    styles.audioLabelText,
                    { color: currentPrimaryColor },
                  ]}
                >
                  Sesli Not
                </Text>
              </View>
              <NoteAudioPlayerBubble uri={audioUri} />
            </View>
          )}

          {/* İçerik Inputu */}
          <NoteTextInput
            placeholder="Notunu yazmaya başla..."
            placeholderTextColor={currentPrimaryColor}
            value={content}
            onChangeText={setContent}
            multiline
            style={{ minHeight: 250, lineHeight: 24 }}
            activeColor={currentPrimaryColor}
          />

          {/* Alt Kısım: İşlevsel Araç Çubuğu (Zen moda currentTodos gönderiliyor) */}
          <View style={styles.editorToolbar}>
            <Pressable style={styles.toolbarButton} onPress={handleAddBullet}>
              <Ionicons name="list" size={18} color={currentPrimaryColor} />
              <Text style={styles.toolbarButtonText}>Madde Ekle</Text>
            </Pressable>
            <Pressable
              style={styles.toolbarButton}
              onPress={() =>
                router.push({
                  pathname: "/zen-editor",
                  params: {
                    currentContent: content,
                    currentTodos: JSON.stringify(todos), // 🔥 Zen moda mevcut yapılacakları aktarıyoruz
                    currentAudioUri: audioUri ?? "",
                  },
                })
              }
            >
              <Ionicons
                name="expand-outline"
                size={18}
                color={currentPrimaryColor}
              />
              <Text style={styles.toolbarButtonText}>Zen Modu</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
