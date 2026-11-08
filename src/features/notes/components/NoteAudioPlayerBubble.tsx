// components/NoteAudioPlayerBubble.tsx
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AudioPlayerBubbleProps {
  uri: string;
  primaryColor?: string;
  showLabel?: boolean;
  labelTitle?: string;
  onDelete?: () => void;
}

export function NoteAudioPlayerBubble({
  uri,
  primaryColor = Colors.primary,
  showLabel = true,
  labelTitle = "Sesli Not",
  onDelete,
}: AudioPlayerBubbleProps) {
  const safeUri =
    uri.startsWith("file://") || uri.startsWith("http") ? uri : `file://${uri}`;

  const player = useAudioPlayer(safeUri);
  const status = useAudioPlayerStatus(player);

  const handlePlayPause = async () => {
    try {
      if (status.currentTime >= (status.duration ?? 0) - 0.1) {
        await player.seekTo(0);
      }

      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (e) {
      console.log("Ses oynatma hatası:", e);
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

  const barHeights = [
    0.3, 0.5, 0.8, 1.0, 0.6, 0.4, 0.85, 0.5, 0.9, 0.6, 0.75, 0.4, 0.7, 0.9, 0.5,
    0.3,
  ];
  const totalBars = barHeights.length;
  const activeIndex = Math.floor(progress * totalBars);

  return (
    <View style={styles.wrapper}>
      {/* Üst Başlık ve Şık Minimal Silme Butonu */}
      {showLabel && (
        <View style={styles.audioHeaderRow}>
          <View style={styles.leftLabelContainer}>
            <View
              style={[
                styles.micIconContainer,
                { backgroundColor: primaryColor + "15" },
              ]}
            >
              <Ionicons name="mic" size={12} color={primaryColor} />
            </View>
            <Text style={[styles.audioLabelText, { color: primaryColor }]}>
              {labelTitle}
            </Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteIconButton}
              activeOpacity={0.7}
              hitSlop={10}
            >
              <Ionicons name="close" size={14} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modern Oynatıcı Kartı */}
      <View style={[styles.container, { borderColor: primaryColor + "25" }]}>
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.playButton, { backgroundColor: primaryColor }]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={status.playing ? "pause" : "play"}
            size={13}
            color="#fff"
            style={status.playing ? {} : { marginLeft: 1.5 }}
          />
        </TouchableOpacity>

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
                      height: Math.max(20 * scale, 4),
                      backgroundColor: isActive ? primaryColor : "#CBD5E1",
                      opacity: isActive ? 1 : 0.6,
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.durationText}>{durationText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  audioHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  leftLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  micIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  audioLabelText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  // 🔥 Yeni minimalist yuvarlak silme butonu tasarımı
  deleteIconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 12,
    alignSelf: "stretch",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  waveformMock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 24,
    flex: 1,
  },
  waveBar: {
    width: 3.5,
    borderRadius: 2,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.2,
    minWidth: 34,
    textAlign: "right",
  },
});
