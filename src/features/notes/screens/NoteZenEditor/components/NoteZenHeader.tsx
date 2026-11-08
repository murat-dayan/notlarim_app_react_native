// NoteZenEditor/components/NoteZenHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type NoteZenHeaderProps = {
  wordCount: number;
  readingTime: number;
  isRecording: boolean;
  currentPrimaryColor: string;
  handleTransferAndExit: () => void;
  styles: any;
};

export function NoteZenHeader({
  wordCount,
  readingTime,
  isRecording,
  currentPrimaryColor,
  handleTransferAndExit,
  styles,
}: NoteZenHeaderProps) {
  return (
    <View style={styles.topBar}>
      {/* Sol Kısım: İstatistikler ve Kompakt Kayıt İndikatörü */}
      <View style={styles.headerLeftSection}>
        <View style={styles.statsContainer}>
          <Text style={[styles.statText, { color: currentPrimaryColor }]}>
            {wordCount} kelime
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.statText, { color: currentPrimaryColor }]}>
            {readingTime} dk
          </Text>
        </View>

        {isRecording && (
          <View style={styles.recordingPill}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Kayıt</Text>
          </View>
        )}
      </View>

      {/* Sağ Kısım: Aktar & Dön Butonu */}
      <TouchableOpacity
        style={[styles.exitButton, { backgroundColor: currentPrimaryColor }]}
        onPress={handleTransferAndExit}
        activeOpacity={0.8}
      >
        <Ionicons name="checkmark" size={15} color="#FFFFFF" />
        <Text style={styles.exitText}>Aktar & Dön</Text>
      </TouchableOpacity>
    </View>
  );
}
