import { useConfirmStore } from "@/store/useConfirmStore";
import { ConfirmModal } from "./ConfirmModal";

export function GlobalConfirmModal() {
  const {
    visible,
    title,
    message,
    confirmText,
    cancelText,
    confirmColor,
    onConfirm,
    hideConfirm,
  } = useConfirmStore();

  return (
    <ConfirmModal
      visible={visible}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmColor={confirmColor}
      onConfirm={() => {
        onConfirm();
        hideConfirm();
      }}
      onCancel={hideConfirm}
    />
  );
}
