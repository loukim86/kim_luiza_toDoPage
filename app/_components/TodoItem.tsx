"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Edit2, Save, X } from "lucide-react";
import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  boardId: string;
  updateTodo: (boardId: string, todoId: string, newContent: string) => void;
  deleteTodo: (boardId: string, todoId: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  boardId,
  updateTodo,
  deleteTodo,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: todo.id,
      data: {
        type: "todo",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.content);

  const handleSave = () => {
    updateTodo(boardId, todo.id, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(todo.content);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 p-3 mb-2 rounded border group relative"
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 text-sm md:text-base border rounded outline-none"
            placeholder="Add task..."
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2 py-1 text-xs md:text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-2 py-1 text-xs md:text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2">
         <p className="flex-grow py-1 text-sm md:text-base">{todo.content}</p>
         <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-500 hover:text-blue-700 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => deleteTodo(boardId, todo.id)}
               className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-100"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
