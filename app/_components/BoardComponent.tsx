import React from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Board } from "../types";
import { TodoItem } from "./TodoItem";

interface BoardComponentProps {
  board: Board;
  updateBoardTitle: (boardId: string, newTitle: string) => void;
  deleteBoard: (boardId: string) => void;
  addTodo: (boardId: string) => void;
  updateTodo: (boardId: string, todoId: string, newContent: string) => void;
  deleteTodo: (boardId: string, todoId: string) => void;
}

export const BoardComponent: React.FC<BoardComponentProps> = ({
  board,
  updateBoardTitle,
  deleteBoard,
  addTodo,
  updateTodo,
  deleteTodo,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: board.id,
      data: {
        type: "board",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md w-full md:w-80 flex-shrink-0"
      {...attributes}
      {...listeners}
    >
      <div className="p-3 md:p-4 border-b flex items-center justify-between">
        <input
          value={board.title}
          onChange={(e) => updateBoardTitle(board.id, e.target.value)}
          className="font-bold w-2/3 outline-none text-sm md:text-base"
        />
        <button
          onClick={() => deleteBoard(board.id)}
          className="text-red-500 hover:text-red-700 text-xs md:text-sm px-2 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      <div className="p-4 min-h-[200px]">
        <SortableContext
          items={board.todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {board.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              boardId={board.id}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={() => addTodo(board.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          + Add New Task
        </button>
      </div>
    </div>
  );
};
