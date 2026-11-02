import { Colors } from "@/constants/colors";
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCustomHeader } from "../components/NoteCustomHeader";
import { NoteTextInput } from "../components/NoteTextInput";
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

  const handleAddBullet = () => {
    // Eğer metin boş değilse ve son karakter yeni satır değilse alt alta şık durması için yeni satır ekleriz
    const bulletPrefix =
      content.length > 0 && !content.endsWith("\n") ? "\n• " : "• ";
    setContent(content + bulletPrefix);
  };

  const characterCount = content.length;

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

      <NoteTextInput
        placeholder="Başlık"
        label="Başlık Ekleyin"
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

      <View style={styles.editorContainer}>
        {/* 🔥 Üst Kısım: Tarih ve Canlı Karakter Sayacı Rozeti */}
        <View style={styles.editorHeaderMeta}>
          <View style={styles.metaBadge}>
            <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{getCurrentFormattedTime()}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Ionicons name="text-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{characterCount} karakter</Text>
          </View>
        </View>

        {/* İçerik Inputu */}
        <NoteTextInput
          placeholder="Notunu yazmaya başla..."
          value={content}
          onChangeText={setContent}
          multiline
          style={{ minHeight: 250, lineHeight: 24 }}
        />

        {/* 🔥 Alt Kısım: İşlevsel Araç Çubuğu */}
        <View style={styles.editorToolbar}>
          <Pressable style={styles.toolbarButton} onPress={handleAddBullet}>
            <Ionicons name="list" size={18} color={Colors.primary} />
            <Text style={styles.toolbarButtonText}>Madde Ekle</Text>
          </Pressable>

          <Pressable
            style={styles.toolbarButton}
            onPress={() => {
              // İleride etiket ekleme modalını açmak için burayı bağlayabilirsin
            }}
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color={Colors.textMain}
            />
            <Text style={styles.toolbarButtonText}>Etiket</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
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
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  editorHeaderMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  editorToolbar: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  toolbarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolbarButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
});
