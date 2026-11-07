import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/colors";
import { TodoItem } from "../types";

interface NoteTodoListProps {
  todos: TodoItem[];
  primaryColor?: string;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo?: (todoId: string) => void;
  variant?: "card" | "plain";
}

export function NoteTodoList({
  todos,
  primaryColor = Colors.primary,
  onToggleTodo,
  onDeleteTodo,
  variant = "card",
}: NoteTodoListProps) {
  if (todos.length === 0) return null;

  const doneCount = todos.filter((todo) => todo.done).length;

  const content = (
    <>
      {variant === "card" && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: primaryColor }]}>
            Yapılacaklar
          </Text>

          <Text style={styles.counter}>
            {doneCount}/{todos.length} tamamlandı
          </Text>
        </View>
      )}

      {todos.map((todo) => (
        <View key={todo.id} style={styles.row}>
          <TouchableOpacity
            onPress={() => onToggleTodo(todo.id)}
            hitSlop={8}
            style={styles.check}
          >
            <Ionicons
              name={todo.done ? "checkbox" : "square-outline"}
              size={20}
              color={todo.done ? primaryColor : Colors.textMuted}
            />
          </TouchableOpacity>

          <Text style={[styles.text, todo.done && styles.textDone]}>
            {todo.text}
          </Text>

          {onDeleteTodo && (
            <TouchableOpacity
              onPress={() => onDeleteTodo(todo.id)}
              hitSlop={8}
              style={styles.deleteButton}
            >
              <Ionicons
                name="trash-outline"
                size={17}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </>
  );

  if (variant === "plain") {
    return <>{content}</>;
  }

  return (
    <View style={[styles.card, { borderColor: primaryColor + "30" }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  counter: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  check: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMain,
  },
  textDone: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 2,
  },
});
