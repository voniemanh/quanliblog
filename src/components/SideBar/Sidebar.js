import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
import Tags from "./Tags";
import Categories from "./Categories";
import "./Sidebar.css";

function Sidebar({ categories, onSelectCategory }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.isAdmin === true);
      } catch (error) {
        console.error("Invalid user data in localStorage", error);
      }
    }
  }, []);

  const handleViewUserList = () => {
    navigate("/user-list");
  };

  return (
    <div>
      <Categories categories={categories} onSelectCategory={onSelectCategory} />
      <Calendar />
      <Tags />

      {isAdmin && (
        <div
          className="view-user-list bg-light"
          style={{
            cursor: "pointer",
            padding: "10px",
            marginTop: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            textAlign: "center",
            color: "#007bff",
            userSelect: "none",
          }}
          onClick={handleViewUserList}
        >
          View User List
        </div>
      )}
    </div>
  );
}

export default Sidebar;
