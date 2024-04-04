import  { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "../styles/dashboard.css";
import { useDispatch } from "react-redux";
import { logout } from "../state/counter/authSlice";

// Define the Todo interface
interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  time: string;
  user: string;
  __v: number;
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const [data, setData] = useState<Todo[]>([]); // Use the Todo interface as the state type

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      const response = await fetch(
        "https://todoappapi-nk0o.onrender.com/api/todos/allTodos",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": `${token}`,
          },
        }
      );
      if (response.ok) {
        const jsonData: Todo[] = await response.json(); // Ensure jsonData is of type Todo[]
        setData(jsonData);
        console.log("Data:", jsonData);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const currentDate = new Date();
    const pastDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - pastDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return years + (years === 1 ? " year ago" : " years ago");
    } else if (months > 0) {
      return months + (months === 1 ? " month ago" : " months ago");
    } else if (days > 0) {
      return days + (days === 1 ? " day ago" : " days ago");
    } else if (hours > 0) {
      return hours + (hours === 1 ? " hour ago" : " hours ago");
    } else if (minutes > 0) {
      return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    } else {
      return seconds + (seconds === 1 ? " second ago" : " seconds ago");
    }
  };

  return (
    <main>
      <div className="navbar">
        <div className="header">
          <img src={logo} alt="" />
        </div>
        <div className="content">
          <div className="message">
            <p>Welcome Tuyishime Hope</p>
          </div>
          <div className="logout">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
      <div className="dataContent">
        <div className="cards">
          <div className="card">
            <h3>Todos</h3>
            <div className="cardAlign">
              <span>{data.length}</span>
              <button>View All</button>
            </div>
          </div>
          <div className="card">
            <h3>New Feature</h3>
            <div className="cardAlign">
              <span>Coming</span>
              <button>View All</button>
            </div>
          </div>
        </div>
        <div className="dataGraph">
          {data.map((todo, index) => (
            <div className="todoUser" key={index}>
              <p>{todo.title}</p>
              <span>{formatDate(todo.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
