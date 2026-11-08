import { Colors } from "@/constants/colors";
import { TodoItem } from "@/features/notes/types";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NoteTodoList } from "../../../components/NoteTodoList";

type NoteZenTodoPanelProps = {
  isTodoPanelOpen: boolean;
  isTodoPanelMinimized: boolean;
  todos: TodoItem[];
  doneCount: number;
  newTodoText: string;
  setNewTodoText: (text: string) => void;
  currentPrimaryColor: string;
  handleMinimizeTodoPanel: () => void;
  handleCloseTodoPanel: () => void;
  handleRestoreTodoPanel: () => void;
  handleAddTodo: () => void;
  handleToggleTodo: (id: string) => void;
  handleDeleteTodo: (id: string) => void;
  styles: any;
};

export function NoteZenTodoPanel({
  isTodoPanelOpen,
  isTodoPanelMinimized,
  todos,
  doneCount,
  newTodoText,
  setNewTodoText,
  currentPrimaryColor,
  handleMinimizeTodoPanel,
  handleCloseTodoPanel,
  handleRestoreTodoPanel,
  handleAddTodo,
  handleToggleTodo,
  handleDeleteTodo,
  styles,
}: NoteZenTodoPanelProps) {
  if (!isTodoPanelOpen) return null;

  if (isTodoPanelMinimized) {
    return (
      <TouchableOpacity
        onPress={handleRestoreTodoPanel}
        activeOpacity={0.7}
        style={[
          styles.minimizedTodoBubble,
          { borderColor: currentPrimaryColor + "40" },
        ]}
      >
        <Ionicons
          name="bookmark-outline"
          size={20}
          color={currentPrimaryColor}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[styles.todoCard, { borderColor: currentPrimaryColor + "30" }]}
    >
      <View style={styles.todoHeader}>
        <Text style={[styles.todoTitle, { color: currentPrimaryColor }]}>
          Yapılacaklar
        </Text>
        <View style={styles.todoHeaderRight}>
          {todos.length > 0 && (
            <Text style={styles.todoCounter}>
              {doneCount}/{todos.length} tamamlandı
            </Text>
          )}
          <TouchableOpacity
            onPress={handleMinimizeTodoPanel}
            hitSlop={8}
            style={styles.todoHeaderBtn}
          >
            <Ionicons
              name="chevron-down"
              size={18}
              color={currentPrimaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCloseTodoPanel}
            hitSlop={8}
            style={styles.todoHeaderBtn}
          >
            <Ionicons name="close" size={18} color={currentPrimaryColor} />
          </TouchableOpacity>
        </View>
      </View>

      {todos.length > 0 && (
        <ScrollView
          style={styles.todoList}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          <NoteTodoList
            todos={todos}
            primaryColor={currentPrimaryColor}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            variant="plain"
          />
        </ScrollView>
      )}

      <View style={styles.todoInputRow}>
        <TextInput
          style={styles.todoInput}
          placeholder="Yeni madde ekle..."
          placeholderTextColor={Colors.textMuted}
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          style={[
            styles.todoAddBtn,
            { backgroundColor: currentPrimaryColor + "20" },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={currentPrimaryColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
