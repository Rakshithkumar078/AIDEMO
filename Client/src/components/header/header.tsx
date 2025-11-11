import { Link } from "react-router-dom";
import DropdownNotification from "./dropdown/notification";
import DropdownProfile from "./dropdown/profile";
import ThemePanel from "../theme-panel/theme-panel";
import { AppSettings } from "./../../config/app-settings";
import * as React from "react";
import { useEffect } from "react";

const Header = () => {

  return (
    <AppSettings.Consumer>
      {({ toggleAppSidebarMobile, appSidebarNone }) => (
        <div id="header" className="app-header">
          <div className="navbar-header">
            <Link to="/backtodashboard" className="navbar-brand">
              <span className="navbar-logo">
                <img src="/assets/img/images/Allogo.svg" alt="" />
              </span>{" "}
            </Link>

            {!appSidebarNone && (
              <button
                type="button"
                className="navbar-mobile-toggler"
                onClick={toggleAppSidebarMobile}
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            )}
          </div>
          <div className="navbar-nav">
            <ThemePanel />
              <DropdownNotification
              />
            <DropdownProfile />
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
};

export default Header;
