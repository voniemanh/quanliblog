import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_URL, POST_URL } from '../../config';
import Sidebar from '../SideBar/Sidebar';
import Comments from '../Comments/CommentList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage({ currentUser, users: propUsers, setUsers: setPropUsers }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const syncPostsAuthorsComments = (postsData, usersData) => {
    return postsData.map(post => {
      const user = usersData.find(u => u.nickname === post.author) || {};
      const updatedComments = (post.comments || []).map(comment => {
        const commentUser = usersData.find(u => u.nickname === comment.nickname) || {};
        return {
          ...comment,
          nickname: commentUser.nickname || comment.nickname,
          authorAvatar: commentUser.authorAvatar || ""
        };
      });

      return {
        ...post,
        author: user.nickname || post.author,
        authorAvatar: user.authorAvatar || "",
        comments: updatedComments,
      };
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let usersData = propUsers;
      if (!usersData || usersData.length === 0) {
        const userRes = await axios.get(USER_URL);
        usersData = userRes.data;
        setPropUsers?.(usersData);
      }

      const postRes = await axios.get(POST_URL);
      const loggedUser = currentUser
        ? usersData.find(u => u.id === currentUser.id)
        : null;

      let visiblePosts = postRes.data.filter(post => {
        if (!post.isPrivate) return true;
        return loggedUser?.isAdmin || post.author === loggedUser?.nickname;
      });

      visiblePosts = syncPostsAuthorsComments(visiblePosts, usersData);

      setPosts(visiblePosts);
      setCategories(["All", ...new Set(visiblePosts.map(p => p.category))]);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser, propUsers]);

  const filteredPosts = selectedCategory
    ? posts.filter(p => p.category === selectedCategory)
    : posts;

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setEditTitle(post.title);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditTitle("");
  };

  const handleSaveEdit = async (id) => {
    try {
      const oldPost = posts.find(p => p.id === id);
      if (!oldPost) return;

      const updatedPost = {
        ...oldPost, 
        title: editTitle,
        content: editContent
      };

      await axios.put(`${POST_URL}/${id}`, updatedPost);
      setPosts(posts.map(p => (p.id === id ? updatedPost : p)));
      handleCancelEdit();
    } catch (err) {
      console.error("Lỗi khi lưu bài viết:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này?")) return;
    try {
      await axios.delete(`${POST_URL}/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá bài viết:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Đang tải...</p>;
  }

  return (
    <div style={{ backgroundColor: '#c9d8db', minHeight: '100vh', fontFamily: 'serif' }}>
      <header className="text-center py-5">
        <h1 className="display-4 fw-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Dev's Blog
        </h1>
      </header>

      <div className="container pb-5">
        <div className="row">
          <div className="col-lg-8">
            {filteredPosts.map((post) => (
              <div className="card mb-5 shadow-sm border-0 position-relative" key={post.id}>
                <div className="card-body">
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt="Thumbnail"
                      style={{ width: '100%', height: 'auto', marginBottom: '1rem' }}
                    />
                  )}

                  {editingPostId === post.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <ReactQuill
                        theme="snow"
                        value={editContent}
                        onChange={setEditContent}
                        className="mb-3"
                        style={{ backgroundColor: 'white' }}
                      />
                      <div className="mt-3">
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSaveEdit(post.id)}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancelEdit}
                        >
                          Huỷ
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <small className="text-uppercase fw-bold text-warning">
                        {post.category || 'Uncategorized'}
                      </small>

                      <h2 className="h4 mt-2">{post.title}</h2>

                      <p className="text-muted small mb-1">
                        {new Date(post.datePost).toLocaleDateString('vi-VN')}
                      </p>

                      <p className="text-muted small fst-italic mb-3 d-flex justify-content-between align-items-center">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {post.authorAvatar && (
                            <img
                              src={post.authorAvatar}
                              alt={post.author}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginRight: '10px',
                                border: '2px solid #ddd'
                              }}
                            />
                          )}
                          Tác giả: {post.author}
                        </span>
                        {currentUser && (currentUser.isAdmin || currentUser.nickname === post.author) && (
                          <span>
                            <a
                              href="#!"
                              onClick={() => handleEditClick(post)}
                              style={{ cursor: 'pointer', marginRight: '10px', textDecoration: 'underline', color: '#0d6efd' }}
                            >
                              Sửa
                            </a>
                            |
                            <a
                              href="#!"
                              onClick={() => handleDelete(post.id)}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'red', textDecoration: 'underline' }}
                            >
                              Xoá
                            </a>
                          </span>
                        )}
                      </p>

                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      <Comments
                        post={post}
                        currentUser={currentUser}
                        onUpdatePost={(updatedPost) => {
                          setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
                        }}
                        users={propUsers}
                      />
                      <div className="mt-3">
                        {post.tags?.length > 0 ? (
                          post.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge bg-secondary me-2"
                              style={{ fontSize: '0.8rem' }}
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">No tags</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4 sidebar-sticky">
            <Sidebar
              categories={categories}
              onSelectCategory={(cat) => setSelectedCategory(cat === "All" ? null : cat)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
