import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_URL, POST_URL } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserList({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newUser, setNewUser] = useState({ nickname: '', email: '', password: '' });
  const [oldNickname, setOldNickname] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      alert('Bạn cần đăng nhập để truy cập');
      navigate('/login');
      return;
    }

    const currUser = JSON.parse(storedUser);
    if (!currUser.isAdmin) {
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
    setOldNickname(user.nickname);
  };

  const handleSaveEdit = async (id) => {
    try {
      const userToUpdate = users.find(u => u.id === id);
      if (!userToUpdate) return;
      const updatedUser = { ...userToUpdate, ...editData };
      await axios.put(`${USER_URL}/${id}`, updatedUser);

      if (oldNickname && oldNickname !== editData.nickname) {
        const postRes = await axios.get(POST_URL);
        const posts = postRes.data;

        const updatePostPromises = posts.map(async (post) => {
          let updated = false;
          const newPost = { ...post };

          if (newPost.author === oldNickname) {
            newPost.author = editData.nickname;
            updated = true;
          }

          if (newPost.comments && Array.isArray(newPost.comments)) {
            newPost.comments = newPost.comments.map(comment => {
              if (comment.nickname === oldNickname) {
                updated = true;
                return { ...comment, nickname: editData.nickname };
              }
              return comment;
            });
          }

          if (updated) {
            await axios.put(`${POST_URL}/${newPost.id}`, newPost);
          }
        });

        await Promise.all(updatePostPromises);
      }

      fetchUsers();
      setEditId(null);

      if (currentUser && currentUser.id === id) {
        const newCurrentUser = { ...currentUser, ...editData };
        localStorage.setItem('currentUser', JSON.stringify(newCurrentUser));
        if (setCurrentUser) setCurrentUser(newCurrentUser);
      }
    } catch (err) {
      console.error("Lỗi khi sửa người dùng:", err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      axios.delete(`${USER_URL}/${id}`)
        .then(() => {
          fetchUsers();

          if (currentUser && currentUser.id === id) {
            localStorage.removeItem('currentUser');
            if (setCurrentUser) setCurrentUser(null);
            navigate('/login');
          }
        })
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
