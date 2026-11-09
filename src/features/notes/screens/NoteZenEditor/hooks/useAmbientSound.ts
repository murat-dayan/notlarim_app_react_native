// features/notes/hooks/useAmbientSound.ts
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";

const SOUND_FILES = {
  rain: require("../../../../../../assets/sounds/rain.mp3"),
  fireplace: require("../../../../../../assets/sounds/fire.mp3"),
  cafe: require("../../../../../../assets/sounds/cafe.mp3"),
};

export type SoundKey = keyof typeof SOUND_FILES;

export function useAmbientSound() {
  const [currentSoundKey, setCurrentSoundKey] = useState<SoundKey | null>(null);
  const [audioSource, setAudioSource] = useState<any>(null);

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  // Ses kaynağı değiştiğinde ve player yüklendiğinde otomatik oynat
  useEffect(() => {
    if (player && audioSource) {
      player.loop = true;
      player.play();
    }
  }, [audioSource, player]);

  const playAmbient = (key: SoundKey) => {
    console.log("🎵 playAmbient tetiklendi, seçilen tuş:", key);

    // Eğer aynı ses zaten çalıyorsa durdur (toggle mantığı da olabilir)
    if (currentSoundKey === key && status.playing) {
      player.pause();
      setCurrentSoundKey(null);
      setAudioSource(null);
      return;
    }

    if (player && status.playing) {
      player.pause();
    }

    setCurrentSoundKey(key);
    setAudioSource(SOUND_FILES[key]); // Bu değiştiğinde useEffect tetiklenecek ve çalacak!
  };

  // 🔥 Yeni Eklendi: Oynat / Durdur (Toggle) Özelliği
  const togglePlayPause = () => {
    if (!player) return;
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const stopAmbient = () => {
    console.log("🛑 stopAmbient tetiklendi.");
    if (player) {
      player.pause();
    }
    setCurrentSoundKey(null);
    setAudioSource(null);
  };

  return {
    currentSoundKey,
    isPlaying: status.playing,
    playAmbient,
    togglePlayPause,
    stopAmbient,
  };
}
