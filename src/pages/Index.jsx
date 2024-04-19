import React, { useState } from "react";
import { Box, Checkbox, Input, Button, VStack, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaSave, FaTrash } from "react-icons/fa";

const initialTodos = [
  {
    id: 1,
    text: "Learn React",
    checked: false,
    children: [
      { id: 2, text: "Learn about components", checked: false, children: [] },
      { id: 3, text: "Learn about props", checked: false, children: [] },
    ],
  },
  { id: 4, text: "Learn Chakra-UI", checked: false, children: [] },
];

const Index = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const toast = useToast();

  const handleCheck = (id, checked) => {
    const updateCheck = (todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          todo.checked = checked;
        }
        if (todo.children) {
          todo.children = updateCheck(todo.children);
        }
        return todo;
      });

    setTodos(updateCheck([...todos]));
  };

  const handleAddTodo = (parentId = null) => {
    const newTodo = {
      id: Date.now(),
      text: "New Todo",
      checked: false,
      children: [],
    };

    if (parentId === null) {
      setTodos([...todos, newTodo]);
    } else {
      const addTodo = (todos) =>
        todos.map((todo) => {
          if (todo.id === parentId) {
            todo.children.push(newTodo);
          }
          if (todo.children) {
            todo.children = addTodo(todo.children);
          }
          return todo;
        });

      setTodos(addTodo([...todos]));
    }
  };

  const handleEdit = (id) => {
    const findTodoText = (todos) => {
      for (let todo of todos) {
        if (todo.id === id) {
          return todo.text;
        }
        if (todo.children.length > 0) {
          const found = findTodoText(todo.children);
          if (found) return found;
        }
      }
      return null;
    };

    setEditId(id);
    setEditText(findTodoText(todos));
  };

  const handleSaveEdit = () => {
    const saveEdit = (todos) =>
      todos.map((todo) => {
        if (todo.id === editId) {
          todo.text = editText;
        }
        if (todo.children) {
          todo.children = saveEdit(todo.children);
        }
        return todo;
      });

    setTodos(saveEdit([...todos]));
    setEditId(null);
    setEditText("");
    toast({
      title: "Todo updated.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDelete = (id) => {
    const deleteTodo = (todos) =>
      todos.filter((todo) => {
        if (todo.id === id) return false;
        if (todo.children) {
          todo.children = deleteTodo(todo.children);
        }
        return true;
      });

    setTodos(deleteTodo([...todos]));
  };

  const renderTodos = (todos, level = 0) => {
    return todos.map((todo) => (
      <Box key={todo.id} pl={`${level * 20}px`}>
        <HStack spacing={4}>
          <Checkbox isChecked={todo.checked} onChange={(e) => handleCheck(todo.id, e.target.checked)}>
            {todo.id === editId ? <Input value={editText} onChange={(e) => setEditText(e.target.value)} /> : todo.text}
          </Checkbox>
          <IconButton icon={<FaPlus />} onClick={() => handleAddTodo(todo.id)} aria-label="Add sub-todo" />
          {todo.id === editId ? <IconButton icon={<FaSave />} onClick={handleSaveEdit} aria-label="Save todo" /> : <IconButton icon={<FaEdit />} onClick={() => handleEdit(todo.id)} aria-label="Edit todo" />}
          <IconButton icon={<FaTrash />} onClick={() => handleDelete(todo.id)} aria-label="Delete todo" />
        </HStack>
        {todo.children.length > 0 && <VStack align="start">{renderTodos(todo.children, level + 1)}</VStack>}
      </Box>
    ));
  };

  return (
    <VStack spacing={4} align="stretch">
      {renderTodos(todos)}
      <Button leftIcon={<FaPlus />} onClick={() => handleAddTodo()} colorScheme="teal">
        Add Todo
      </Button>
    </VStack>
  );
};

export default Index;
