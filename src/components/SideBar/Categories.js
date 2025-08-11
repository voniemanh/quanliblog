import React from "react";

function Categories({ categories, onSelectCategory }) {
  
  return (
    <div className="p-3 mb-4 bg-pink rounded shadow-sm">
      <h5 className="mb-3 fw-bold">Categories</h5>
      <div className="list-group">
        {categories.map((cat, index) => (
          <span
            key={index}
            className="list-group-item list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Categories;
