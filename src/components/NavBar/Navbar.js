import "./NavBar.css";
import '../../App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };
  
  const EditProfileModal = ({ setShowModal, navigate, currentUser }) => {
    return (
      <div
        className="modal fade show"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={() => setShowModal(false)}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content shadow-sm rounded">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa thông tin</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="modal-body">
              <p>Bạn có muốn chỉnh sửa profile không?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowModal(false);
                  navigate(`/edit-profile/${currentUser.id}`);
                }}
              >
                Đến trang chỉnh sửa
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="left">
        <a href="/">Home</a>
        {currentUser && (
          <button
            className="btn btn-success btn-sm ms-2"
            onClick={() => navigate('/add-post')}
          >
            + Thêm bài viết
          </button>
        )}
      </div>
      <div className="right" style={{ position: 'relative' }}>
        {currentUser ? (
          <>
            <span
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              onClick={() => setShowModal(true)}
            >
              Hello, {currentUser.nickname}
            </span>
            <span
              style={{ cursor: 'pointer', color: 'grey', marginLeft: '10px' }}
              onClick={handleLogout}
            >
              Logout
            </span>

            {showModal && (
              <EditProfileModal
                setShowModal={setShowModal}
                navigate={navigate}
                currentUser={currentUser}
              />
            )}
          </>
        ) : (
          <div>
            <Link to="/login" className="me-2">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
