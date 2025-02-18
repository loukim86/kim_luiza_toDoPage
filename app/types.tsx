export interface Todo {
  id: string;
  content: string;
}

export interface Board {
  id: string;
  title: string;
  todos: Todo[];
}
