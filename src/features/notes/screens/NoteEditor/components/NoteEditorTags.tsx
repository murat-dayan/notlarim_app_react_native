import { Colors } from "@/constants/colors";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../NoteEditor.styles";

// Hazır popüler etiket seçenekleri
const PREDEFINED_TAGS = [
  "İş",
  "Kişisel",
  "Fikir",
  "Önemli",
  "Alışveriş",
  "Eğitim",
];

interface NoteEditorTagsProps {
  selectedTags: string[];
  currentPrimaryColor: string;
  customTagInput: string;
  isAddingCustom: boolean;
  onToggleTag: (tag: string) => void;
  onCustomTagInputChange: (value: string) => void;
  onAddingCustomChange: (value: boolean) => void;
  onAddCustomTag: () => void;
}

export function NoteEditorTags({
  selectedTags,
  currentPrimaryColor,
  customTagInput,
  isAddingCustom,
  onToggleTag,
  onCustomTagInputChange,
  onAddingCustomChange,
  onAddCustomTag,
}: NoteEditorTagsProps) {
  return (
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
              onPress={() => onToggleTag(tag)}
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

        {/* Kullanıcının kendi özel etiketleri */}
        {selectedTags
          .filter((tag) => !PREDEFINED_TAGS.includes(tag))
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
              onPress={() => onToggleTag(tag)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tagText, styles.selectedTagText]}>
                {tag} ✓
              </Text>
            </TouchableOpacity>
          ))}

        {/* Özel etiket ekleme */}
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
              onChangeText={onCustomTagInputChange}
              onSubmitEditing={onAddCustomTag}
              autoFocus
            />

            <TouchableOpacity
              onPress={onAddCustomTag}
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
            onPress={() => onAddingCustomChange(true)}
          >
            <Text style={styles.addTagText}>+ Yeni Etiket</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
