"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Board, Todo } from "../types";
import { BoardComponent } from "./BoardComponent";

const KanbanBoard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const savedBoards = localStorage.getItem("kanbanBoards");
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanbanBoards", JSON.stringify(boards));
  }, [boards]);

  const addBoard = () => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title: "New Task Board",
      todos: [],
    };
    setBoards([...boards, newBoard]);
  };

  const updateBoardTitle = (boardId: string, newTitle: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId ? { ...board, title: newTitle } : board
      )
    );
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter((board) => board.id !== boardId));
  };

  const addTodo = (boardId: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      content: "",
    };
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? { ...board, todos: [...board.todos, newTodo] }
          : board
      )
    );
  };

  const updateTodo = (boardId: string, todoId: string, newContent: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              todos: board.todos.map((todo) =>
                todo.id === todoId ? { ...todo, content: newContent } : todo
              ),
            }
          : board
      )
    );
  };

  const deleteTodo = (boardId: string, todoId: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              todos: board.todos.filter((todo) => todo.id !== todoId),
            }
          : board
      )
    );
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeType = active.data?.current?.type;
    const overType = over.data?.current?.type;

    if (activeType === "board" && overType === "board") {
      const oldIndex = boards.findIndex((board) => board.id === activeId);
      const newIndex = boards.findIndex((board) => board.id === overId);
      setBoards(arrayMove(boards, oldIndex, newIndex));
      return;
    }

    const activeBoard = boards.find((board) =>
      board.todos.some((todo) => todo.id === activeId)
    );
    const overBoard = boards.find(
      (board) =>
        board.id === overId || board.todos.some((todo) => todo.id === overId)
    );

    if (!activeBoard || !overBoard) return;

    if (activeBoard.id === overBoard.id) {
      const oldIndex = activeBoard.todos.findIndex(
        (todo) => todo.id === activeId
      );
      const newIndex = activeBoard.todos.findIndex(
        (todo) => todo.id === overId
      );

      const newTodos = arrayMove(activeBoard.todos, oldIndex, newIndex);

      setBoards(
        boards.map((board) =>
          board.id === activeBoard.id ? { ...board, todos: newTodos } : board
        )
      );
    } else {
      const task = activeBoard.todos.find((todo) => todo.id === activeId);
      if (!task) return;

      const newSourceTodos = activeBoard.todos.filter(
        (todo) => todo.id !== activeId
      );

      const overTodoIndex = overBoard.todos.findIndex(
        (todo) => todo.id === overId
      );
      const newDestTodos = [...overBoard.todos];
      newDestTodos.splice(
        overTodoIndex >= 0 ? overTodoIndex : newDestTodos.length,
        0,
        task
      );

      setBoards(
        boards.map((board) => {
          if (board.id === activeBoard.id)
            return { ...board, todos: newSourceTodos };
          if (board.id === overBoard.id)
            return { ...board, todos: newDestTodos };
          return board;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-4 sticky top-0 z-10 bg-gray-100 py-2">
        <button
          onClick={addBoard}
          className="bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded hover:bg-blue-600 shadow-sm"
        >
          Add New Board
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-4 md:overflow-x-auto pb-4">
          <SortableContext
            items={boards.map((board) => board.id)}
            strategy={horizontalListSortingStrategy}
          >
            {boards.map((board) => (
              <BoardComponent
                key={board.id}
                board={board}
                updateBoardTitle={updateBoardTitle}
                deleteBoard={deleteBoard}
                addTodo={addTodo}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
