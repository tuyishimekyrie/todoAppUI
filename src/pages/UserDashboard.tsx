import React, { useEffect, useState } from "react";
import logoImg from "../assets/logo.png";
import "../styles/userDashboard.css";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { logout } from "../state/counter/authSlice";

interface Todo {
  _id: number;
  title: string;
  completed: boolean; // New property to indicate if the todo is completed or not
}

export default function UserDashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoName, setTodoName] = useState<string>("");
  
  const dispatch = useDispatch();
console.log(todos)
  useEffect(() => {
    fetchTodos(); // Fetch todos when the component mounts
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (!token) {
        // Handle case where token is not available
        console.error("Token not found in localStorage");
        return;
      }
      const response = await fetch(
        "https://todoappapi-nk0o.onrender.com/api/todos",
        {
          method: "GET",
          headers: {
            // Add any headers if needed
            "Content-Type": "application/json",
            // You may also include the token for authentication
            "x-auth-token": `${token}`,
          },
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setTodos(jsonData);
        console.log("Data:", jsonData);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (todoName.trim() !== "") {
  //     const newTodo: Todo = {
  //       id: Date.now(),
  //       name: todoName,
  //       completed: false, 
  //     };
  //     setTodos([...todos, newTodo]);
  //     setTodoName("");
  //   }
  // };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (todoName.trim() !== "") {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (!token) {
        // Handle case where token is not available
        console.error("Token not found in localStorage");
        return;
      }

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
        const newTodo: Todo = await response.json(); // Assuming the server returns the created todo object
       setTodos([newTodo, ...todos]); // Update the UI with the newly created todo
        setTodoName("");
        console.log("Todo created successfully");
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
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
      // Handle case where token is not available
      console.error("Token not found in localStorage");
      return;
    }
    console.log(id)

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

    if (response.ok) {
      // Remove the deleted todo from the UI
      setTodos(todos.filter((todo) => todo._id !== id));
      console.log("Todo deleted successfully");
    } else {
      console.error("Failed to delete todo");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};


  const handleComplete = async (id: number) => {
  console.log(id)
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
      // Handle case where token is not available
      console.error("Token not found in localStorage");
      return;
    }

    const response = await fetch(
      `https://todoappapi-nk0o.onrender.com/api/todos/${id}/complete`,
      {
        method: "PATCH", // or "PATCH" depending on your API design
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": `${token}`,
        },
      }
    );

    if (response.ok) {
      // Update the completed status of the todo in the UI
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: true } : todo
        )
      );
      console.log("Todo marked as completed successfully");
    } else {
      console.error("Failed to mark todo as completed");
    }
  } catch (error) {
    console.error("Error marking todo as completed:", error);
  }
};

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <main>
      <header>
        <img src={logoImg} alt="logo" />
        <p>Welcome User</p>
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
          <button type="submit">Submit</button>
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
                  <div
                    className="name"
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.title}
                  </div>
                  <div className="todoactions">
                    <MdEdit
                      color="#3b82f6"
                      size={30}
                      onClick={() => console.log("clicked")}
                    />
                    <GrStatusGood
                      color="#cbd5e1"
                      size={30}
                      onClick={() => handleComplete(todo._id)}
                    />
                    <MdDelete
                      color="#dc2626"
                      size={30}
                      onClick={() => handleDelete(todo._id)}
                    />
                  </div>
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
