import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_URL } from '../../config';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newUser, setNewUser] = useState({ nickname: '', email: '', password: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      alert('Bạn cần đăng nhập để truy cập');
      navigate('/login');
      return;
    }

    const currentUser = JSON.parse(storedUser);
    if (!currentUser.isAdmin) {
      alert('Bạn không có quyền truy cập trang này');
      navigate('/');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = () => {
    axios.get(USER_URL)
      .then(res => setUsers(res.data))
      .catch(err => console.error("Lỗi khi tải danh sách người dùng:", err))
      .finally(() => setLoading(false));
  };

  const handleAddUser = () => {
    if (!newUser.nickname || !newUser.email || !newUser.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    axios.post(USER_URL, newUser)
      .then(() => {
        fetchUsers();
        setNewUser({ nickname: '', email: '', password: '' });
      })
      .catch(err => console.error("Lỗi khi thêm người dùng:", err));
  };

  const handleEditClick = (user) => {
    setEditId(user.id);
    setEditData({ nickname: user.nickname, email: user.email });
  };

  const handleSaveEdit = (id) => {
    axios.put(`${USER_URL}/${id}`, editData)
      .then(() => {
        fetchUsers();
        setEditId(null);
      })
      .catch(err => console.error("Lỗi khi sửa người dùng:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      axios.delete(`${USER_URL}/${id}`)
        .then(fetchUsers)
        .catch(err => console.error("Lỗi khi xóa:", err));
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-4">Quản lý người dùng</h1>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nickname</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Hàng thêm */}
          <tr>
            <td>+</td>
            <td>
              <input 
                type="text" 
                className="form-control"
                value={newUser.nickname}
                onChange={e => setNewUser({ ...newUser, nickname: e.target.value })}
              />
            </td>
            <td>
              <input 
                type="email" 
                className="form-control"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
            </td>
            <td>
              <input 
                type="password" 
                className="form-control"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              />
            </td>
            <td>
              <button className="btn btn-success btn-sm" onClick={handleAddUser}>
                Lưu
              </button>
            </td>
          </tr>

          {/* Danh sách */}
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  {editId === user.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editData.nickname}
                      onChange={e => setEditData({ ...editData, nickname: e.target.value })}
                    />
                  ) : (
                    user.nickname
                  )}
                </td>
                <td>
                  {editId === user.id ? (
                    <input
                      type="email"
                      className="form-control"
                      value={editData.email}
                      onChange={e => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>••••••</td>
                <td>
                  {editId === user.id ? (
                    <>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleSaveEdit(user.id)}>
                        Lưu
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(user)}>
                        Sửa
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Không có người dùng nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
