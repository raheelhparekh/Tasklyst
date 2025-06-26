import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";

function Navbar() {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      // console.log("inside logout function");
      await logout();
      // console.log("Logout successful");
    } catch (error) {
      console.error("Logout error", error);
    }
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">Tasklyst</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary>Projects</summary>
              <ul className="p-2">
                <li>
                  <a>Project 1</a>
                </li>
                <li>
                  <a>Project 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="navbar-end dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="btn">Profile</a>
          </li>
          <li>
            <a className="btn" onClick={onLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
