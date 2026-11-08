import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NoteAudioPlayerBubble } from "../../components/NoteAudioPlayerBubble";
import { NoteCustomHeader } from "../../components/NoteCustomHeader";
import { NoteTextInput } from "../../components/NoteTextInput";
import { NoteTodoList } from "../../components/NoteTodoList";
import { styles } from "./NoteEditor.styles";
import { NoteEditorMetaBar } from "./components/NoteEditorMetaBar";
import { NoteEditorTags } from "./components/NoteEditorTags";
import { NoteEditorToolbar } from "./components/NoteEditorToolbar";
import { useNoteEditor } from "./hooks/useNoteEditor";

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
        <NoteEditorTags
          selectedTags={selectedTags}
          currentPrimaryColor={currentPrimaryColor}
          customTagInput={customTagInput}
          isAddingCustom={isAddingCustom}
          onToggleTag={toggleTag}
          onCustomTagInputChange={setCustomTagInput}
          onAddingCustomChange={setIsAddingCustom}
          onAddCustomTag={handleAddCustomTag}
        />

        <View style={styles.editorContainer}>
          {/* Üst Kısım: Tarih ve Canlı Karakter Sayacı Rozetleri */}
          <NoteEditorMetaBar
            characterCount={characterCount}
            currentPrimaryColor={currentPrimaryColor}
            styles={styles}
          />

          {/* Yapılacaklar Listesi */}
          {todos.length > 0 && (
            <NoteTodoList
              todos={todos}
              primaryColor={currentPrimaryColor}
              onToggleTodo={handleToggleTodo}
            />
          )}

          {/* Sesli Not Bloku */}
          {audioUri && (
            <NoteAudioPlayerBubble
              uri={audioUri}
              primaryColor={currentPrimaryColor}
            />
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

          {/* Alt Araç Çubuğu */}
          <NoteEditorToolbar
            content={content}
            todos={todos}
            audioUri={audioUri}
            currentPrimaryColor={currentPrimaryColor}
            handleAddBullet={handleAddBullet}
            styles={styles}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
