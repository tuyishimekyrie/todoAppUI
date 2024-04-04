import React, { useEffect, useState } from "react";
import logoImg from "../assets/logo.png";
import "../styles/userDashboard.css";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { logout } from "../state/counter/authSlice";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
interface Todo {
  _id: number;
  title: string;
  completed: boolean; // New property to indicate if the todo is completed or not
}

export default function UserDashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoName, setTodoName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoName, setEditedTodoName] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  console.log(todos);
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      console.log(tokenData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(tokenData);
      console.log(decoded);
      setUserName(decoded.name);
    }
    fetchTodos();
    toast.loading("Loading...");
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      const response = await fetch(
        "https://todoappapi-nk0o.onrender.com/api/todos",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setTodos(jsonData);
        console.log("Data:", jsonData);
        toast.dismiss();
        toast.success("Successfully Loaded Data");
      } else {
        toast.dismiss();
        toast.error("Failed to fetch data");
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoName.trim() !== "") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }
        setIsLoading(true);
        const response = await fetch(
          "https://todoappapi-nk0o.onrender.com/api/todos/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": `${token}`,
            },
            body: JSON.stringify({ title: todoName }),
          }
        );

        if (response.ok) {
          const newTodo: Todo = await response.json();
          setTodos([newTodo, ...todos]);
          setTodoName("");
          console.log("Todo created successfully");
          setIsLoading(false);
        } else {
          console.error("Failed to create todo");
        }
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoName(e.target.value);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        
        console.error("Token not found in localStorage");
        return;
      }
      console.log(id);

      const response = await fetch(
        `https://todoappapi-nk0o.onrender.com/api/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
        }
      );
      toast.loading("Todo is Being Deleted...");
      if (response.ok) {
        
        setTodos(todos.filter((todo) => todo._id !== id));
        console.log("Todo deleted successfully");
        toast.success("Todo deleted successfully");
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleComplete = async (id: number) => {
    console.log(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const response = await fetch(
        `https://todoappapi-nk0o.onrender.com/api/todos/${id}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
        }
      );
      toast.loading("Todo is Being marked...");
      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, completed: true } : todo
          )
        );
        console.log("Todo marked as completed successfully");
        toast.success("Todo marked as completed successfully");
      } else {
        console.error("Failed to mark todo as completed");
      }
    } catch (error) {
      console.error("Error marking todo as completed:", error);
    }
  };

  const handleEdit = (id: number) => {
    setEditingTodoId(id);
    const todoToEdit = todos.find((todo) => todo._id === id);
    if (todoToEdit) {
      setEditedTodoName(todoToEdit.title);
    }
  };

  const handleUpdate = async () => {
    if (!editedTodoName.trim()) return;

    try {
      const updatedTodo = { _id: editingTodoId, title: editedTodoName };
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      setIsLoadingUpdate(true);
      const response = await fetch(
        `https://todoappapi-nk0o.onrender.com/api/todos/${editingTodoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      if (response.ok) {
        setTodos(todos);
        setIsLoadingUpdate(false);
        fetchTodos();
        console.log("Todo marked as completed successfully");
      } else {
        setIsLoadingUpdate(false);

        console.error("Failed to mark todo as completed");
      }
      console.log(updatedTodo);
    } catch (error) {
      setIsLoadingUpdate(false);

      console.error("Error updating todo:", error);
    } finally {
      setEditingTodoId(null);
      setEditedTodoName("");
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login")
  };
  if (isLoading) {
    toast.loading("Submitting...");
  } else {
    toast.dismiss();
  }
  return (
    <main>
      <Toaster position="top-right" richColors />
      <header>
        <img src={logoImg} alt="logo" />
        <p>Welcome {username}</p>
        <button onClick={() => handleLogout()}>Logout</button>
      </header>
      <section>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1>Add Todo</h1>
          <div className="input">
            <label htmlFor="name">Todo Name</label>
            <input
              type="text"
              name="name"
              placeholder="Type todo name"
              value={todoName}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="list">
          <h1>List Of Todos</h1>
          {todos.length > 0 ? (
            <div className="renderList">
              {todos.map((todo) => (
                <div
                  className={`todolist ${todo.completed ? "completed" : ""}`}
                  key={todo._id}
                >
                  {editingTodoId === todo._id ? (
                    <>
                      <input
                        type="text"
                        value={editedTodoName}
                        className="updateInput"
                        onChange={(e) => setEditedTodoName(e.target.value)}
                      />
                      <button
                        className="updateBtn"
                        onClick={handleUpdate}
                        disabled={isLoadingUpdate}
                      >
                        {isLoadingUpdate ? "Updating..." : "Update"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        className="name"
                        style={{
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {todo.title}
                      </div>
                      <div className="todoactions">
                        {!todo.completed && (
                          <MdEdit
                            color="#3b82f6"
                            size={30}
                            className="icon"
                            onClick={() => handleEdit(todo._id)}
                          />
                        )}
                        {!todo.completed && (
                          <GrStatusGood
                            color="#cbd5e1"
                            size={30}
                            onClick={() => handleComplete(todo._id)}
                          />
                        )}
                        <MdDelete
                          color="#dc2626"
                          size={30}
                          onClick={() => handleDelete(todo._id)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No todos</p>
          )}
        </div>
      </section>
    </main>
  );
}
