// store/useConfirmStore.ts
import { create } from "zustand";

type ConfirmState = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  // Modalı açmak için kullanılan fonksiyon
  showConfirm: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    onConfirm: () => void;
  }) => void;
  // Modalı kapatmak için
  hideConfirm: () => void;
};

export const useConfirmStore = create<ConfirmState>((set) => ({
  visible: false,
  title: "",
  message: "",
  confirmText: "Evet, Sil",
  cancelText: "Vazgeç",
  confirmColor: "#EF4444",
  onConfirm: () => {},

  showConfirm: (config) =>
    set({
      visible: true,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || "Evet, Sil",
      cancelText: config.cancelText || "Vazgeç",
      confirmColor: config.confirmColor || "#EF4444",
      onConfirm: config.onConfirm,
    }),

  hideConfirm: () => set({ visible: false }),
}));
