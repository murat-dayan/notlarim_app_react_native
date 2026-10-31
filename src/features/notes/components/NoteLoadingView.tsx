import { Colors } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function NoteLoadingView() {
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Yükleniyor...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background, // Hafif modern bir arka plan tonu
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3, // Android için gölge
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textMuted, // Şık bir gri tonu
  },
});
