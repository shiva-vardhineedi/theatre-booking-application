import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutButton from './Logout'; // Import the LogoutButton component

const Navbar = (currentPage) => {
  const history = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
      <Link className="navbar-brand" to="/landing">SMC Movies</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className={`nav-link ${currentPage === 'tickets' ? 'active' : ''}`} href="#" onClick={() => history('/tickets')}>Your Tickets</a>
          </li>
            {/* Add more navigation items here */}
          </ul>
          <div className="ms-auto">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
