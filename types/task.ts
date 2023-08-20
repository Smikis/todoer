export type Task = {
  due: number | null;
  id: string;
  isDone: boolean;
  repeating: boolean;
  value: string;
};
