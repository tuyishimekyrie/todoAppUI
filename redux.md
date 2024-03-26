import React from 'react'
// import Signup from './pages/Signup'
import { useDispatch, useSelector } from 'react-redux'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import UserDashboard from './pages/UserDashboard'
import { AppDispatch, RootState } from './state/store'
import { decrement, increment, incrementAsync, incrementByAmount } from './state/counter/counterSlice';
import { login, logout } from './state/counter/authSlice';
export default function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  const authValue = useSelector((state: RootState) => state.auth.user);
  return (
    // <Signup />
    // <Login/>
    // <Dashboard/>
    // <UserDashboard/>
    <>
      <h2>{authValue ? "IsLoggedIn" : "Not LoggedIn"}</h2>
      <button onClick={() => dispatch(login())}>Login</button>
      <button onClick={() => dispatch(logout())}>Logout</button>
      <h2>{count}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementAsync(100))}>
        IncrementAsync by 100
      </button>
      <button onClick={() => dispatch(incrementByAmount(10))}>
        Increment By 10
      </button>
    </>
  );
}
