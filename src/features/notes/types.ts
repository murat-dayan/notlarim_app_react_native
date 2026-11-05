export type Workspace = {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: number;
};

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isLocked: boolean;
  workspaceId: string; // 🔥 Eklendi
  audioUri?: string;
  todos?: TodoItem[];
};
