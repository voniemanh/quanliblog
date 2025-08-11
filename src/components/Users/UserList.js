import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { USER_URL } from '../../config';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Bạn cần đăng nhập để truy cập');
      navigate('/login');
      return;
    }

    axios.get(USER_URL)
      .then(res => {
        setUsers(res.data);
      })
      .catch(error => console.error("Lỗi khi tải danh sách người dùng:", error))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return null;

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <Link to="/add-user">Thêm người dùng mới</Link>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <Link to={`/edit-user/${user.id}`}>Sửa</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
