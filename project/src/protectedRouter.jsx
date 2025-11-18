import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/profile", {
      withCredentials: true,   
    })
    .then(() => setAuth(true))
    .catch(() => setAuth(false));
  }, []);
  
  
  if (auth === null) return <p>Loading...</p>;
  if (auth === false) return (<Navigate to="/login" />)

  return children;
}
