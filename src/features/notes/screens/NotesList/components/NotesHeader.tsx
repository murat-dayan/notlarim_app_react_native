// NotesList/components/NotesHeader.tsx
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { NoteRoundIconButton } from "../../../components/NoteRoundIconButton";
import { NoteSearchBar } from "../../../components/NoteSearchBar";

type NotesHeaderProps = {
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  toggleSearch: () => void;
  isSortMenuOpen: boolean;
  toggleSortMenu: () => void;
  closeSortMenu: () => void;
  sortBy: string;
  setSortBy: (sort: any) => void;
  currentPrimaryColor: string;
  handleOpenVault: () => void;
  styles: any;
};

export function NotesHeader({
  isSearchOpen,
  searchQuery,
  setSearchQuery,
  toggleSearch,
  isSortMenuOpen,
  toggleSortMenu,
  closeSortMenu,
  sortBy,
  setSortBy,
  currentPrimaryColor,
  handleOpenVault,
  styles,
}: NotesHeaderProps) {
  return (
    <View style={styles.normalHeader}>
      {isSearchOpen ? (
        <View style={styles.searchBarContainer}>
          <NoteSearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <NoteRoundIconButton
            icon={<Ionicons name="close" size={22} color={Colors.textMain} />}
            onPress={toggleSearch}
          />
        </View>
      ) : (
        <View style={styles.headerContent}>
          <View style={styles.headerIcons}>
            <NoteRoundIconButton
              icon={
                <Ionicons name="search" size={20} color={Colors.textMain} />
              }
              onPress={toggleSearch}
            />

            <View style={{ position: "relative" }}>
              <NoteRoundIconButton
                icon={
                  <Ionicons
                    name="filter-outline"
                    size={20}
                    color={Colors.textMain}
                  />
                }
                onPress={toggleSortMenu}
              />

              {isSortMenuOpen && (
                <View style={styles.dropdownMenu}>
                  <Text style={styles.menuTitle}>Sıralama Ölçütü</Text>

                  <Pressable
                    style={[
                      styles.menuItem,
                      sortBy === "en yeniler" && styles.activeMenuItem,
                    ]}
                    onPress={() => {
                      setSortBy("en yeniler");
                      closeSortMenu();
                    }}
                  >
                    <Text
                      style={[
                        styles.menuText,
                        sortBy === "en yeniler" && [
                          styles.activeMenuText,
                          { color: currentPrimaryColor },
                        ],
                      ]}
                    >
                      En Yeni
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.menuItem,
                      sortBy === "en eskiler" && styles.activeMenuItem,
                    ]}
                    onPress={() => {
                      setSortBy("en eskiler");
                      closeSortMenu();
                    }}
                  >
                    <Text
                      style={[
                        styles.menuText,
                        sortBy === "en eskiler" && [
                          styles.activeMenuText,
                          { color: currentPrimaryColor },
                        ],
                      ]}
                    >
                      En Eski
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.menuItem,
                      sortBy === "alfabetik" && styles.activeMenuItem,
                    ]}
                    onPress={() => {
                      setSortBy("alfabetik");
                      closeSortMenu();
                    }}
                  >
                    <Text
                      style={[
                        styles.menuText,
                        sortBy === "alfabetik" && [
                          styles.activeMenuText,
                          { color: currentPrimaryColor },
                        ],
                      ]}
                    >
                      Alfabetik (A-Z)
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            <NoteRoundIconButton
              icon={
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={Colors.textMain}
                />
              }
              onPress={handleOpenVault}
            />
          </View>
        </View>
      )}
    </View>
  );
}
