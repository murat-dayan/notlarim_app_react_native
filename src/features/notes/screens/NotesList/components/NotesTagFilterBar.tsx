// NotesList/components/NotesTagFilterBar.tsx
import { Pressable, ScrollView, Text, View } from "react-native";

type NotesTagFilterBarProps = {
  allUniqueTags: string[];
  selectedTagFilter: string | null;
  setSelectedTagFilter: (tag: string | null) => void;
  currentPrimaryColor: string;
  styles: any;
};

export function NotesTagFilterBar({
  allUniqueTags,
  selectedTagFilter,
  setSelectedTagFilter,
  currentPrimaryColor,
  styles,
}: NotesTagFilterBarProps) {
  if (allUniqueTags.length === 0) return null;

  return (
    <View style={styles.filterBarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <Pressable
          style={[
            styles.filterChip,
            selectedTagFilter === null && [
              styles.activeFilterChip,
              {
                backgroundColor: currentPrimaryColor,
                borderColor: currentPrimaryColor,
              },
            ],
          ]}
          onPress={() => setSelectedTagFilter(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedTagFilter === null && styles.activeFilterChipText,
            ]}
          >
            Tümü
          </Text>
        </Pressable>

        {allUniqueTags.map((tag) => {
          const isSelected = selectedTagFilter === tag;
          return (
            <Pressable
              key={tag}
              style={[
                styles.filterChip,
                isSelected && [
                  styles.activeFilterChip,
                  {
                    backgroundColor: currentPrimaryColor,
                    borderColor: currentPrimaryColor,
                  },
                ],
              ]}
              onPress={() => setSelectedTagFilter(isSelected ? null : tag)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.activeFilterChipText,
                ]}
              >
                #{tag}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
