import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteButton } from "../components/NoteButton";
import { NoteCustomHeader } from "../components/NoteCustomHeader";
import { useNotesStore } from "../store/useNotesStore";

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

  const existing = useNotesStore((s) => s.notes.find((n) => n.id === id));

  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");

  // 🔥 Seçilen etiketleri dizi olarak tutuyoruz
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existing?.tags ?? [],
  );

  // Özel yeni etiket eklemek için input state'i
  const [customTagInput, setCustomTagInput] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

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
    if (!title.trim() && !content.trim()) {
      router.back();
      return;
    }

    if (id) {
      await updateNote(id, title, content, selectedTags);
    } else {
      await addNote(title, content, selectedTags);
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <NoteCustomHeader
        title={id ? "Notu düzenle" : "Yeni Not"}
        leftIcon={
          <Ionicons name="arrow-back" size={20} color={Colors.textMain} />
        }
        onLeftPress={router.back}
      />

      <TextInput
        style={styles.titleInput}
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
      />

      {/* 🔥 İnteraktif Etiket Seçim Alanı */}
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
                style={[styles.tagChip, isSelected && styles.selectedTagChip]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tagText, isSelected && styles.selectedTagText]}
                >
                  {tag} {isSelected ? "✓" : "+"}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Kullanıcının kendi özel etiketleri (hazır listede olmayanlar) */}
          {selectedTags
            .filter((t) => !PREDEFINED_TAGS.includes(t))
            .map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, styles.selectedTagChip]}
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
            <View style={styles.customTagInputContainer}>
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
                style={styles.addTagConfirmBtn}
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

      <TextInput
        style={styles.contentInput}
        placeholder="Notunu yaz..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <View style={[styles.buttons, { paddingBottom: insets.bottom + 45 }]}>
        {id && (
          <NoteButton title="Sil" onPress={handleDelete} variant="secondary" />
        )}
        <NoteButton title="Kaydet" onPress={handleSave} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 12,
  },
  tagsSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingVertical: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTagChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textMain,
  },
  selectedTagText: {
    color: "#FFFFFF",
  },
  addTagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  addTagText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  customTagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingLeft: 10,
    overflow: "hidden",
  },
  customTagInput: {
    fontSize: 13,
    color: Colors.textMain,
    paddingVertical: 4,
    width: 90,
  },
  addTagConfirmBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addTagConfirmText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  contentInput: { flex: 1, fontSize: 16 },
  buttons: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    width: "100%",
    justifyContent: "center",
  },
});
