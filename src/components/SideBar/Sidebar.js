import React from "react";
import Calendar from "./Calendar";
import Tags from "./Tags";
import Categories from "./Categories";
import "./Sidebar.css"; 

function Sidebar({ categories, onSelectCategory }) {
  return (
    <div>
      <Categories categories={categories} onSelectCategory={onSelectCategory} />
      <Calendar />
      <Tags />
    </div>
  );
}

export default Sidebar;