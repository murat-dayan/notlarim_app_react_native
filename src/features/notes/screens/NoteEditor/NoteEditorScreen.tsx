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
    latitude,
    longitude,
    isGettingLocation,
    handleAddCurrentLocation,
    handleRemoveLocation,
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

          {/* 📍 Konum Gösterge ve Ekleme Alanı */}
          <View style={{ marginVertical: 8 }}>
            {latitude && longitude ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: currentPrimaryColor + "15",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: currentPrimaryColor + "40",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="location"
                    size={18}
                    color={currentPrimaryColor}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: currentPrimaryColor,
                      fontWeight: "500",
                    }}
                  >
                    Konum eklendi ({latitude.toFixed(4)}, {longitude.toFixed(4)}
                    )
                  </Text>
                </View>
                <TouchableOpacity onPress={handleRemoveLocation}>
                  <Ionicons name="close-circle" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleAddCurrentLocation}
                disabled={isGettingLocation}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  alignSelf: "flex-start",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: Colors.border || "#e2e8f0",
                }}
              >
                {isGettingLocation ? (
                  <ActivityIndicator size="small" color={currentPrimaryColor} />
                ) : (
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={currentPrimaryColor}
                  />
                )}
                <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                  {isGettingLocation
                    ? "Konum alınıyor..."
                    : "Bu nota konum ekle"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

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
