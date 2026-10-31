export const getCurrentFormattedTime = (): string => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];
  const day = now.getDate();
  const month = months[now.getMonth()];

  return `${day} ${month}, ${hours}:${minutes}`;
};

// İleride lazım olabilecek başka bir tarih formatı (Örn: Veritabanından gelen ISO tarihi için)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()} ${["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][date.getMonth()]}, ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};
