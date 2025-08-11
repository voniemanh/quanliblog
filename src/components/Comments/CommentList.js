import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { POST_URL } from '../../config';

function CommentList({ post, currentUser, onUpdatePost, users }) {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const getUserById = (id) => users?.find(u => u.id === id);

  const handleAddComment = async () => {
    if (!currentUser) {
      alert('Bạn cần đăng nhập để bình luận');
      return;
    }
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      message: newComment,
      date: new Date().toISOString(),
    };

    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), comment],
    };

    await axios.put(`${POST_URL}/${post.id}`, updatedPost);
    onUpdatePost(updatedPost);
    setNewComment('');
  };

  const handleDeleteComment = async (id) => {
    const comment = post.comments.find(c => c.id === id);
    if (!comment) return;

    if (!currentUser || (!currentUser.isAdmin && currentUser.id !== comment.authorId)) {
      alert('Bạn không có quyền xoá bình luận này.');
      return;
    }

    if (!window.confirm('Xoá comment này?')) return;

    const updatedPost = {
      ...post,
      comments: post.comments.filter(c => c.id !== id),
    };
    await axios.put(`${POST_URL}/${post.id}`, updatedPost);
    onUpdatePost(updatedPost);
  };

  const handleSaveEdit = async (id) => {
    const comment = post.comments.find(c => c.id === id);
    if (!comment) return;

    if (!currentUser || (!currentUser.isAdmin && currentUser.id !== comment.authorId)) {
      alert('Bạn không có quyền sửa bình luận này.');
      return;
    }

    const updatedPost = {
      ...post,
      comments: post.comments.map(c =>
        c.id === id ? { ...c, message: editContent } : c
      ),
    };
    await axios.put(`${POST_URL}/${post.id}`, updatedPost);
    onUpdatePost(updatedPost);
    setEditingCommentId(null);
    setEditContent('');
  };

  return (
    <div className="mt-4">
      <h5>Bình luận</h5>

      {/* Danh sách comment */}
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((c) => {
          const user = getUserById(c.authorId);
          const avatarUrl = user?.authorAvatar || null;
          const nickname = user?.nickname || 'Unknown';

          return (
            <div key={c.id} className="border rounded p-2 mb-2 bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <strong className="d-flex align-items-center">
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt={nickname}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '8px',
                        border: '2px solid #ddd'
                      }}
                    />
                  )}
                  {nickname}
                </strong>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(c.date).toLocaleString('vi-VN')}
                </small>
              </div>

              {editingCommentId === c.id ? (
                <>
                  <ReactQuill
                    theme="snow"
                    value={editContent}
                    onChange={setEditContent}
                    className="mb-2"
                    style={{ backgroundColor: 'white' }}
                  />
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleSaveEdit(c.id)}
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent('');
                    }}
                  >
                    Huỷ
                  </button>
                </>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: c.message }} />
              )}

              {/* Nút sửa / xoá */}
              {currentUser && (currentUser.isAdmin || currentUser.id === c.authorId) && editingCommentId !== c.id && (
                <div className="mt-2">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingCommentId(c.id);
                      setEditContent(c.message);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    Xoá
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-muted">Chưa có bình luận nào.</p>
      )}

      {/* Thêm comment mới */}
      {currentUser && (
        <div className="mt-3">
          <ReactQuill
            theme="snow"
            value={newComment}
            onChange={setNewComment}
            style={{ backgroundColor: 'white' }}
          />
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={handleAddComment}
          >
            Gửi bình luận
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentList;
