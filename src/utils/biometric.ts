import * as LocalAuthentication from "expo-local-authentication";

export async function authenticateBiometric(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    console.log("Donanım var mı?:", hasHardware);
    console.log("Parmak izi kayıtlı mı?:", isEnrolled);

    if (!hasHardware || !isEnrolled) {
      console.log("Biyometrik donanım veya kayıt bulunamadı, atlanıyor.");
      return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Notu açmak için kimliğinizi doğrulayın",
      fallbackLabel: "Şifre Kullan",
      cancelLabel: "İptal",
    });

    console.log("Doğrulama sonucu:", result);
    return result.success;
  } catch (error) {
    console.error("Biyometrik hata:", error);
    return false;
  }
}
