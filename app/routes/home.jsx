import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);
  return null;
}
