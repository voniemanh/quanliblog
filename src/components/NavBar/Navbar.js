import "./NavBar.css";
import '../../App.css';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



function NavBar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
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
      <div className="right">
        {currentUser ? (
          <>
            <span>Hello, {currentUser.nickname} | </span>
            <span style={{ cursor: 'pointer', color: 'grey' }} onClick={handleLogout}>Logout</span>
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
