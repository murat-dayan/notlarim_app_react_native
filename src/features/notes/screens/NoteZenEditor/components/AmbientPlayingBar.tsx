// features/notes/components/AmbientPlayingFooter.tsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SoundKey } from "../hooks/useAmbientSound";

type AmbientPlayingBarProps = {
  currentSoundKey: SoundKey | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  onStop: () => void;
};

// Her ses için uygun ikonlar ekleyerek tasarımı daha canlı hale getirdik
const SOUND_CONFIG: Record<
  SoundKey,
  { title: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  rain: { title: "Pencere Önü Yağmur", icon: "rainy" },
  fireplace: { title: "Şömine Çıtırtısı", icon: "flame" },
  cafe: { title: "Hafif Kafe Uğultusu", icon: "cafe" },
};

export function AmbientPlayingBar({
  currentSoundKey,
  isPlaying,
  onTogglePlayPause,
  onStop,
}: AmbientPlayingBarProps) {
  if (!currentSoundKey) return null;

  const currentSound = SOUND_CONFIG[currentSoundKey];

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.pulseDot} />
        <Ionicons name={currentSound.icon} size={14} color="#38BDF8" />
        <Text style={styles.text}>{currentSound.title}</Text>

        {/* 🔥 Oynat / Durdur Butonu (Duruma göre ikonu ve işlevi değişir) */}
        <TouchableOpacity
          onPress={onTogglePlayPause}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={13}
            color="#38BDF8"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStop}
          style={styles.stopIconBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start", // 🔥 Genişliğin içeriğe göre dinamik olmasını sağlar (ortalar)
    marginVertical: 6,
    zIndex: 10,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A", // Daha derin ve modern bir koyu ton
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 20, // Tam hap (pill) görünümü
    borderWidth: 1,
    borderColor: "#334155",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981", // Canlı yeşil aktiflik noktası
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    color: "#F1F5F9",
    marginRight: 4,
  },
  stopIconBtn: {
    backgroundColor: "#1E293B",
    padding: 3,
    borderRadius: 10,
  },
  actionBtn: {
    backgroundColor: "#1E293B",
    padding: 4,
    borderRadius: 10,
  },
});
