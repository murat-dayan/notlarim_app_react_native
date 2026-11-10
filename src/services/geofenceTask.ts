import { notesRepository } from "@/features/notes/data/notesRepository";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

export const BACKGROUND_GEOFENCE_TASK = "BACKGROUND_GEOFENCE_TASK";

// 🔥 Daha önce bildirim gönderdiğimiz ve hâlâ o bölgede olan notların ID'leri
const notifiedNotes = new Set<string>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

TaskManager.defineTask(BACKGROUND_GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Geofence görev hatası:", error);
    return;
  }

  if (data) {
    const { eventType, region } = data as {
      eventType: Location.GeofencingEventType;
      region: { identifier: string; latitude: number; longitude: number };
    };

    const noteId = region.identifier;

    // 1️⃣ DURUM: Kullanıcı bölgeye GİRDİYSE
    if (eventType === Location.GeofencingEventType.Enter) {
      // Eğer bu nota zaten bu oturumda bildirim atıldıysa tekrar atma!
      if (notifiedNotes.has(noteId)) {
        console.log(
          `ℹ️ Zaten bu bölgedesin, tekrar bildirim atılmadı: ${noteId}`,
        );
        return;
      }

      try {
        const notes = await notesRepository.getAll();
        const note = notes.find((n) => n.id.toString() === noteId);

        if (note) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `📍 Konum Notu: ${note.title || "Başlıksız Not"}`,
              body: note.content
                ? note.content.substring(0, 100) + "..."
                : "Bu konuma yaklaştın!",
              data: { noteId: note.id },
            },
            trigger: null,
          });

          // Notu hafçaya ekle ki bölgedeyken tekrar tetiklenmesin
          notifiedNotes.add(noteId);
          console.log(`🔔 Bölgeye girildi, bildirim gönderildi: ${note.title}`);
        }
      } catch (err) {
        console.error("Geofence bildirim gönderme hatası:", err);
      }
    }

    // 2️⃣ DURUM: Kullanıcı bölgeden ÇIKTIYSA (Akıllı Sıfırlama)
    else if (eventType === Location.GeofencingEventType.Exit) {
      if (notifiedNotes.has(noteId)) {
        notifiedNotes.delete(noteId);
        console.log(
          `🔄 Kullanıcı bölgeden uzaklaştı, hafıza sıfırlandı (Tekrar gelebilir): ${noteId}`,
        );
      }
    }
  }
});

export async function registerGeofencesAsync() {
  try {
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") return;

    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      console.log("Arka plan konum izni verilmedi.");
      return;
    }

    await Notifications.requestPermissionsAsync();

    const notes = await notesRepository.getAll();
    const locationNotes = notes.filter((n) => n.latitude && n.longitude);

    if (locationNotes.length === 0) {
      console.log("Kayıtlı konumlu not bulunamadı.");
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_GEOFENCE_TASK,
      );
      if (isRegistered) {
        await Location.stopGeofencingAsync(BACKGROUND_GEOFENCE_TASK);
      }
      return;
    }

    const regions = locationNotes.map((note) => ({
      identifier: note.id.toString(),
      latitude: note.latitude!,
      longitude: note.longitude!,
      radius: 100, // 100 metre yarıçap
      notifyOnEnter: true,
      notifyOnExit: true, // 🔥 Çıkış olayını da yakalayabilmek için true yaptık!
    }));

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_GEOFENCE_TASK,
    );
    if (isRegistered) {
      await Location.stopGeofencingAsync(BACKGROUND_GEOFENCE_TASK);
    }

    await Location.startGeofencingAsync(BACKGROUND_GEOFENCE_TASK, regions);
    console.log(
      `🚀 Geofencing başarıyla aktif! Takip edilen bölge sayısı: ${regions.length}`,
    );
  } catch (err) {
    console.error("Geofencing başlatma hatası:", err);
  }
}
