import React from 'react'
import { Dropdown } from 'react-bootstrap';
export const Navbar = () => {
    return (
        <nav className="navbar fixed-top navbar-expand-md navbar-dark bg-dark mb-3">
            <div className="flex-row d-flex">
                <button type="button" className="navbar-toggler mr-2 " data-toggle="offcanvas" title="Toggle responsive left sidebar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#" title="Free Bootstrap 4 Admin Template">Document Management System</a>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse" id="collapsingNavbar">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home </a>
                    </li>
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{marginLeft:'65rem'}} >
                         Profile
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#">Change password</Dropdown.Item>
                            <Dropdown.Item href="#">User Setting</Dropdown.Item>
                            <Dropdown.Item href="#">SignOut</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>







                    
                </ul>
            </div>
        </nav>
    )
}
export default Navbar