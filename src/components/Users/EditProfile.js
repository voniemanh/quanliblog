import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { USER_URL, POST_URL } from '../../config';

function EditProfile({ currentUser, setCurrentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    email: '',
    authorAvatar: '',
    isAdmin: false,
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oldNickname, setOldNickname] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${USER_URL}/${id}`);
        setFormData({
          nickname: data.nickname || '',
          password: '',
          email: data.email || '',
          authorAvatar: data.authorAvatar || '',
          isAdmin: data.isAdmin || false,
        });
        setOldNickname(data.nickname || '');
        setAvatarPreview(data.authorAvatar || '');
      } catch (err) {
        console.error('Lỗi khi tải thông tin người dùng:', err);
        setError('Không tải được thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData((prev) => ({ ...prev, authorAvatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password.trim()) delete payload.password;

      const { data, status } = await axios.put(`${USER_URL}/${id}`, payload);

      if (status === 200) {
        // Nếu nickname thay đổi thì update trong post và comment
        if (oldNickname.trim() && oldNickname.trim() !== formData.nickname.trim()) {
          const postRes = await axios.get(POST_URL);
          const posts = postRes.data;

          const updatePostPromises = posts.map(async (post) => {
            let updated = false;
            const newPost = { ...post };

            // Cập nhật author
            if ((newPost.author || '').trim() === oldNickname.trim()) {
              newPost.author = formData.nickname.trim();
              updated = true;
            }

            // Hàm đệ quy để đổi nickname trong comments
            const updateComments = (comments) => {
              return comments.map(comment => {
                let changed = false;
                let updatedComment = { ...comment };

                if ((comment.nickname || '').trim() === oldNickname.trim()) {
                  updatedComment.nickname = formData.nickname.trim();
                  changed = true;
                }

                if (Array.isArray(comment.replies) && comment.replies.length > 0) {
                  updatedComment.replies = updateComments(comment.replies);
                }

                if (changed) updated = true;
                return updatedComment;
              });
            };

            if (Array.isArray(newPost.comments) && newPost.comments.length > 0) {
              newPost.comments = updateComments(newPost.comments);
            }

            if (updated) {
              return axios.put(`${POST_URL}/${newPost.id}`, newPost);
            }
          });

          await Promise.all(updatePostPromises);
        }

        // Nếu là user hiện tại -> update localStorage
        if (currentUser && String(currentUser.id) === String(id)) {
          setCurrentUser(data);
          localStorage.setItem('currentUser', JSON.stringify(data));
        }

        alert('Cập nhật thành công');
        navigate('/');
      } else {
        throw new Error('Phản hồi không hợp lệ');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      alert('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nickname) return <div className="text-center mt-3">Đang tải...</div>;
  if (error) return <div className="text-danger text-center mt-3">{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Chỉnh sửa thông tin cá nhân</h2>

      <div className="mb-3">
        <label htmlFor="nickname" className="form-label">Nickname:</label>
        <input
          type="text"
          className="form-control"
          id="nickname"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Mật khẩu mới (bỏ trống nếu không đổi):</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label d-block">Ảnh đại diện:</label>
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="avatar preview"
            className="mb-2 rounded-circle"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleAvatarChange}
        />
      </div>

      <button onClick={handleSubmit} className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </div>
  );
}

export default EditProfile;
