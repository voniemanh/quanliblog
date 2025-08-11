import "./NavBar.css";
import '../../App.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="left">
        <a href="/">Home</a>
      </div>
      <div className="right">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </nav>
  );
}

export default NavBar;
