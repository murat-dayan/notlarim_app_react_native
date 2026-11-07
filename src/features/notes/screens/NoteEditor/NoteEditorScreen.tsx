import { Colors } from "@/constants/colors";
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { NoteAudioPlayerBubble } from "../../components/NoteAudioPlayerBubble";
import { NoteCustomHeader } from "../../components/NoteCustomHeader";
import { NoteTextInput } from "../../components/NoteTextInput";
import { styles } from "./NoteEditor.styles";
import { useNoteEditor } from "./hooks/useNoteEditor";

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
  const router = useRouter();

  const {
    id,
    existing,
    isLoading,
    workspaces,
    activeWorkspaceId,

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
  } = useNoteEditor();

  const activeWorkspace = workspaces.find(
    (workspace) => workspace.id === activeWorkspaceId,
  );

  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;
  // Düzenlenecek not yükleniyor
  if (id && isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Yükleme tamamlandı ama not bulunamadı
  if (id && !existing) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={Colors.textMuted}
        />

        <Text style={styles.sectionLabel}>Not bulunamadı</Text>

        <Text style={{ color: Colors.textMuted, textAlign: "center" }}>
          Düzenlemek istediğin not silinmiş olabilir.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: Colors.primary }}>Geri dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
