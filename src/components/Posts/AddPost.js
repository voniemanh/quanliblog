import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { POST_URL } from '../../config'; 

function AddPost({ currentUser }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    const now = new Date();
    const newPost = {
      title,
      content,
      author: currentUser.nickname,
      datePost: now.toISOString(),
      isPrivate,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      await fetch(POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      navigate('/'); 
    } catch (error) {
      console.error('Lỗi khi thêm bài viết:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thêm bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>

        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ví dụ: Công nghệ, Du lịch..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tag, cách nhau bằng dấu phẩy"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            id="privateCheck"
          />
          <label className="form-check-label" htmlFor="privateCheck">
            Bài viết riêng tư
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Đăng bài</button>
      </form>
    </div>
  );
}

export default AddPost;
