import { useContext, useState } from 'react';
import { AppSettings } from '../../config/app-settings';
import * as React from 'react';

function ThemePanel() {
    const context = useContext(AppSettings);
    const [theme, setTheme] = useState((localStorage && typeof localStorage.appTheme !== 'undefined') ? localStorage.appTheme : 'blue');
    const themeList = ['DefaultColor','Black', 'Blue', 'Purple', 'Violet'];

    function toggleTheme(e: any, theme: any) {
        e.preventDefault();
        context.handleSetAppTheme(theme);
        setTheme(theme);
    }

    const colorMapping: Record<string, string> = {
        DefaultColor  : "#0057AE",
        Black: "#424242",
        Blue: "#2125ff",
        Purple: "#6a0dad",
        Violet: "#984a95"
    };

    function getColor(theme: string) {
        return colorMapping[theme] || "#000"; // Default to black if not found
    }


    return (
        <>
            <div className="navbar-item dropdown">
                <a
                    href="#/"
                    className="navbar-link dropdown-toggle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                >
                    <div className="border rounded-3 p-2 d-flex align-items-center bg-white">
                        <i className="fa fa-cog fs-4 text-black"></i>
                    </div>
                </a>
                <div className="dropdown-menu dropdown-menu-end me-1">
                    {themeList.map((themeListItem, i) => (
                        <li
                            key={i}
                            className={"theme-list-item " + (themeListItem === theme ? "active" : "")}
                        >
                            <a
                                href="#0"
                                onClick={(e) => toggleTheme(e, themeListItem)}
                                className="dropdown-item d-flex align-items-center"
                            >
                                <div
                                    className="theme-color-circle"
                                    style={{
                                        backgroundColor: getColor(themeListItem),
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                        border: "1px solid #ccc",
                                    }}
                                ></div>
                                {themeListItem}
                            </a>
                        </li>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ThemePanel;
