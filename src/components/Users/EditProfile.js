import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { USER_URL } from '../../config';

function EditProfile({ setCurrentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    email: '',
    authorAvatar: '',
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${USER_URL}/${id}`)
      .then(res => {
        setFormData({
          nickname: res.data.nickname || '',
          password: '',
          email: res.data.email || '',
          authorAvatar: res.data.authorAvatar || '',
        });
        setAvatarPreview(res.data.authorAvatar || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Không tải được thông tin người dùng');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password' && value.trim() !== '') {
      setPasswordError('');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, authorAvatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || formData.password.trim() === '') {
      setPasswordError('Vui lòng nhập mật khẩu mới');
      return;
    }

    axios.put(`${USER_URL}/${id}`, formData)
      .then(res => {
        alert('Cập nhật thành công');
        // Cập nhật lại currentUser ở App
        setCurrentUser(res.data);
        // Cập nhật localStorage
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        navigate('/');
      })
      .catch(() => {
        alert('Cập nhật thất bại');
      });
  };

  if (loading) return <div className="text-center mt-3">Đang tải...</div>;
  if (error) return <div className="text-danger text-center mt-3">{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Chỉnh sửa thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        {/* form fields như bạn có */}
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
          <label htmlFor="password" className="form-label">Password (bắt buộc nhập mật khẩu mới):</label>
          <input
            type="password"
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {passwordError && <div className="invalid-feedback">{passwordError}</div>}
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

        <button type="submit" className="btn btn-primary w-100">Lưu thay đổi</button>
      </form>
    </div>
  );
}

export default EditProfile;
