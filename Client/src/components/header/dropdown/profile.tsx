import * as React from "react";
import { Link, useNavigate } from 'react-router-dom';

function DropdownProfile() {
	const navigate = useNavigate();
	return (
		<div className="navbar-item navbar-user dropdown">
			<Link to="#/" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
				<div className="border rounded-3 py-2 pe-3 d-flex align-items-center bg-white me-2">
					<img src="/assets/img/images/Profile-PNG-File.png" alt="" />
					<span>
						<span className="d-none d-md-inline text-black ps-1">Devtest</span>
						<b className="caret text-black"></b>
					</span>
				</div>
			</Link>
			<div className="dropdown-menu dropdown-menu-end me-1">
				<a href="#" onClick={() => { navigate("/changepassword") }} className="dropdown-item">Change Password</a>
				<a href="#" className="dropdown-item"
					onClick={()=> {navigate("/login")}}>Log Out</a>
			</div>
		</div>
	);
}

export default DropdownProfile;
