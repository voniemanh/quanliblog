import React, { useEffect, useState } from "react";
import axios from "axios";
import {POST_URL} from "../../config";

function Tags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios.get(POST_URL)
      .then(res => {
        const posts = res.data;
        const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
        setTags(allTags);
      })
      .catch(err => console.error("Lỗi khi lấy tags:", err));
  }, []);

  return (
    <div className="p-3 mb-4 bg-light rounded shadow-sm">
      <h5 className="mb-3 fw-bold">Tags</h5>
      <p>{tags.join(", ")}</p>
    </div>
  );
}

export default Tags;
