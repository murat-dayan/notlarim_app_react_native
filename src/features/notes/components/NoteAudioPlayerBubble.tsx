import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AudioPlayerBubbleProps {
  uri: string;
}

export function NoteAudioPlayerBubble({ uri }: AudioPlayerBubbleProps) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const handlePlayPause = async () => {
    // Ses bittiyse başa sar
    if (status.currentTime >= (status.duration ?? 0) - 0.1) {
      await player.seekTo(0);
    }

    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const durationSecs = status.duration ?? 0;
  const currentSecs = status.currentTime ?? 0;

  const remainingSecs = Math.max(durationSecs - currentSecs, 0);
  const displaySecs = status.playing ? remainingSecs : durationSecs;
  const durationText = formatDuration(displaySecs);

  const progress =
    durationSecs > 0 ? Math.min(Math.max(currentSecs / durationSecs, 0), 1) : 0;

  // Daha doğal bir ses dalgası profili için farklı oranlar
  const barHeights = [
    0.3, 0.7, 0.5, 0.9, 1.0, 0.6, 0.8, 0.4, 0.7, 0.3, 0.5, 0.9, 0.4,
  ];
  const totalBars = barHeights.length;
  const activeIndex = Math.floor(progress * totalBars);

  return (
    <View style={styles.container}>
      {/* Oynat / Durdur Butonu */}
      <TouchableOpacity
        onPress={handlePlayPause}
        style={[styles.playButton, { backgroundColor: Colors.primary }]}
        activeOpacity={0.85}
      >
        <Ionicons
          name={status.playing ? "pause" : "play"}
          size={14}
          color="#fff"
          style={status.playing ? {} : { marginLeft: 1.5 }} // Play ikonunun optik ortalaması
        />
      </TouchableOpacity>

      {/* Dalga Çubukları ve Süre */}
      <View style={styles.infoContainer}>
        <View style={styles.waveformMock}>
          {barHeights.map((scale, i) => {
            const isActive = status.playing && i <= activeIndex;
            return (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    height: Math.max(18 * scale, 4),
                    backgroundColor: isActive ? Colors.primary : Colors.border,
                  },
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.durationText}>{durationText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC", // Çok hafif modern bir gri/beyaz tonu
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
    alignSelf: "flex-start",
    marginVertical: 6,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waveformMock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 22,
    justifyContent: "center",
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    minWidth: 32,
    letterSpacing: -0.2,
  },
});
