import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type NoteTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  autoGrow?: boolean; // 🔥 Otomatik büyümeyi açıp kapamak için
};

export function NoteTextInput({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  onFocus,
  onBlur,
  multiline,
  autoGrow = true,
  ...props
}: NoteTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState<number>(120); // Çok satırlı için başlangıç yüksekliği

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.container,
          multiline && { alignItems: "flex-start", paddingVertical: 12 },
          isFocused && styles.containerFocused,
          error && styles.containerError,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            multiline && autoGrow && { height: Math.max(120, inputHeight) },
            leftIcon ? styles.inputWithLeftIcon : null,
            style,
          ]}
          placeholderTextColor={Colors.textMuted}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onContentSizeChange={(e) => {
            if (multiline && autoGrow) {
              setInputHeight(e.nativeEvent.contentSize.height);
            }
          }}
          {...props}
        />

        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
    marginBottom: 6,
    marginLeft: 4,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  containerFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  containerError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textMain,
    paddingVertical: 12,
  },
  multilineInput: {
    paddingTop: 0, // Üst boşluğu sıfırlayarak tam yukarıdan başlatır
    textAlignVertical: "top",
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  leftIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
});
