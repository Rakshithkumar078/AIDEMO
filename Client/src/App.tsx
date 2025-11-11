import * as React from "react";
import { useEffect, useState } from "react";
import { AppSettings } from "./config/app-settings";
import { slideToggle } from "./composables/slideToggle";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import Content from "./components/content/content";
// import SidebarRight from './components/sidebar-right/sidebar-right';
// import TopMenu from './components/top-menu/top-menu';
import { useLocation, useNavigate } from "react-router-dom";
import "./app.css";
function App() {
    const location = useLocation();
    const [appTheme] = useState(
        localStorage && typeof localStorage.appTheme !== "undefined"
            ? localStorage.appTheme
            : "blue"
    );
    const [appClass, setAppClass] = useState('');
    const [appDarkMode, setAppDarkMode] = useState(false);
    const [appGradientEnabled, setAppGradientEnabled] = useState(false);
    const [appHeaderNone, setAppHeaderNone] = useState(false);
    const [appHeaderFixed, setAppHeaderFixed] = useState(true);
    const [appHeaderInverse, setAppHeaderInverse] = useState(false);
    const [appHeaderMegaMenu, setAppHeaderMegaMenu] = useState(false);
    const [appHeaderLanguageBar, setAppHeaderLanguageBar] = useState(false);
    const [hasScroll, setHasScroll] = useState(false);
    const [appSidebarNone, setAppSidebarNone] = useState(false);
    const [appSidebarWide, setAppSidebarWide] = useState(true);
    const [appSidebarLight, setAppSidebarLight] = useState(true);
    const [appSidebarMinify, setAppSidebarMinify] = useState(false);
    const [appSidebarMobileToggled, setAppSidebarMobileToggled] = useState(false);
    const [appSidebarTransparent, setAppSidebarTransparent] = useState(false);
    const [appSidebarSearch, setAppSidebarSearch] = useState(false);
    const [appSidebarFixed, setAppSidebarFixed] = useState(true);
    const [appSidebarGrid, setAppSidebarGrid] = useState(false);
    const [appContentNone, setAppContentNone] = useState(false);
    const [appContentClass, setAppContentClass] = useState("");
    const [appContentFullHeight, setAppContentFullHeight] = useState(false);
    const [appTopMenu, setAppTopMenu] = useState(false);
    const [appTopMenuMobileToggled] = useState(false);
    const [appSidebarTwo, setAppSidebarTwo] = useState(false);
    const [appSidebarEnd, setAppSidebarEnd] = useState(false);
    const [appSidebarEndToggled, setAppSidebarEndToggled] = useState(false);
    const [appSidebarEndMobileToggled, setAppSidebarEndMobileToggled] = useState(false);
    const navigate = useNavigate();

    const handleSetAppClass = (value) => {
		setAppClass(value);
	};

    const handleSetAppHeaderNone = (value: any) => {
        setAppHeaderNone(value);
    };

    const handleSetAppHeaderInverse = (value: any) => {
        setAppHeaderInverse(value);
    };

    const handleSetAppHeaderLanguageBar = (value: any) => {
        setAppHeaderLanguageBar(value);
    };

    const handleSetAppHeaderMegaMenu = (value: any) => {
        setAppHeaderMegaMenu(value);
    };

    const handleSetAppHeaderFixed = (value: any) => {
        if (value === false && appSidebarFixed) {
            alert(
                "Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar."
            );
            setAppSidebarFixed(false);
            if (localStorage) {
                localStorage.appSidebarFixed = false;
            }
        }
        setAppHeaderFixed(value);
        if (localStorage) {
            localStorage.appHeaderFixed = value;
        }
    };

    const handleSetAppSidebarNone = (value: any) => {
        setAppSidebarNone(value);
    };

    const handleSetAppSidebarWide = (value: any) => {
        setAppSidebarWide(value);
    };

    const handleSetAppSidebarLight = (value: any) => {
        setAppSidebarLight(value);
    };

    const handleSetAppSidebarMinified = (value: any) => {
        setAppSidebarMinify(value);
    };

    const handleSetAppSidebarTransparent = (value: any) => {
        setAppSidebarTransparent(value);
    };

    const handleSetAppSidebarSearch = (value: any) => {
        setAppSidebarSearch(value);
    };

    const handleSetAppSidebarFixed = (value: any) => {
        if (value === true && !appHeaderFixed) {
            alert(
                "Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar."
            );
            setAppHeaderFixed(true);
            if (localStorage) {
                localStorage.appHeaderFixed = true;
            }
        }
        setAppSidebarFixed(value);
        if (localStorage) {
            localStorage.appSidebarFixed = value;
        }
    };

    const handleSetAppSidebarGrid = (value: any) => {
        setAppSidebarGrid(value);
        if (localStorage) {
            localStorage.appSidebarGrid = value;
        }
    };

    const toggleAppSidebarMinify = (e: any) => {
        e.preventDefault();
        setAppSidebarMinify(!appSidebarMinify);
        if (localStorage) {
            localStorage.appSidebarMinify = !appSidebarMinify;
        }
    };

    const toggleAppSidebarMobile = (e: any) => {
        e.preventDefault();
        setAppSidebarMobileToggled(!appSidebarMobileToggled);
    };

    const handleSetAppSidebarEnd = (value: any) => {
        setAppSidebarEnd(value);
    };

    const handleSetAppContentNone = (value: any) => {
        setAppContentNone(value);
    };

    const handleSetAppContentClass = (value: any) => {
        setAppContentClass(value);
    };

    const handleSetAppContentFullHeight = (value: any) => {
        setAppContentFullHeight(value);
    };

    const handleSetAppTopMenu = (value: any) => {
        setAppTopMenu(value);
    };

    const toggleAppTopMenuMobile = (e: any) => {
        e.preventDefault();
        slideToggle(document.querySelector(".app-top-menu"));
    };

    const handleSetAppSidebarTwo = (value: any) => {
        setAppSidebarTwo(value);
        setAppSidebarEndToggled(value);
    };

    const handleSetAppBoxedLayout = (value: any) => {
        if (value === true) {
            document.body.classList.add("boxed-layout");
        } else {
            document.body.classList.remove("boxed-layout");
        }
    };

    const handleSetAppDarkMode = (value: any) => {
        if (value === true) {
            document.querySelector("html")?.setAttribute("data-bs-theme", "dark");
        } else {
            document.querySelector("html")?.removeAttribute("data-bs-theme");
        }
        setAppDarkMode(value);
        if (localStorage) {
            localStorage.appDarkMode = value;
        }
        document.dispatchEvent(new Event("theme-reload"));
    };

    const handleSetAppGradientEnabled = (value: any) => {
        setAppGradientEnabled(value);
        if (localStorage) {
            localStorage.appGradientEnabled = value;
        }
    };

    const handleSetAppTheme = (value: any) => {
        const newTheme = "theme-" + value;
        for (let x = 0; x < document.body.classList.length; x++) {
            if (
                document.body.classList[x].indexOf("theme-") > -1 &&
                document.body.classList[x] !== newTheme
            ) {
                document.body.classList.remove(document.body.classList[x]);
            }
        }
        document.body.classList.add(newTheme);

        if (localStorage && value) {
            localStorage.appTheme = value;
        }
        document.dispatchEvent(new Event("theme-reload"));
    };

    const toggleAppSidebarEnd = (e: any) => {
        e.preventDefault();
        setAppSidebarEndToggled(!appSidebarEndToggled);
    };

    const toggleAppSidebarEndMobile = (e: any) => {
        e.preventDefault();
        setAppSidebarEndMobileToggled(!appSidebarEndMobileToggled);
    };

    useEffect(() => {
        handleSetAppTheme(appTheme);
        if (appDarkMode) {
            handleSetAppDarkMode(true);
        }

        const handleScroll = () => {
            if (window.scrollY > 0) {
                setHasScroll(true);
            } else {
                setHasScroll(false);
            }
            const elm = document.getElementsByClassName("nvtooltip");
            for (let i = 0; i < elm.length; i++) {
                elm[i].classList.add("d-none");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [appTheme, appDarkMode]);

    useEffect(() => {
        const hideLayout =
            location.pathname === "/register" || location.pathname === "/" || location.pathname === "/landingpage";
        if (hideLayout) {
            setAppSidebarNone(true);
            setAppHeaderNone(true);
            handleSetAppContentClass("p-0");
        } else {
            setAppSidebarNone(false);
            setAppHeaderNone(false);
            handleSetAppContentClass("");
        }
    }, [location.pathname]);


    return (
        <AppSettings.Provider
            value={{
                appClass,
                appTheme,
                appDarkMode,
                appGradientEnabled,
                appHeaderNone,
                appHeaderFixed,
                appHeaderInverse,
                appHeaderMegaMenu,
                appHeaderLanguageBar,
                hasScroll,
                handleSetAppClass,
                handleSetAppHeaderNone,
                handleSetAppHeaderInverse,
                handleSetAppHeaderLanguageBar,
                handleSetAppHeaderMegaMenu,
                handleSetAppHeaderFixed,
                appSidebarNone,
                appSidebarWide,
                appSidebarLight,
                appSidebarMinify,
                appSidebarMobileToggled,
                appSidebarTransparent,
                appSidebarSearch,
                appSidebarFixed,
                appSidebarGrid,
                handleSetAppSidebarNone,
                handleSetAppSidebarWide,
                handleSetAppSidebarLight,
                handleSetAppSidebarMinified,
                handleSetAppSidebarTransparent,
                handleSetAppSidebarSearch,
                handleSetAppSidebarFixed,
                handleSetAppSidebarGrid,
                toggleAppSidebarMinify,
                toggleAppSidebarMobile,
                appContentNone,
                appContentClass,
                appContentFullHeight,
                handleSetAppContentNone,
                handleSetAppContentClass,
                handleSetAppContentFullHeight,
                appTopMenu,
                appTopMenuMobileToggled,
                toggleAppTopMenuMobile,
                handleSetAppTopMenu,
                appSidebarTwo,
                handleSetAppSidebarTwo,
                appSidebarEnd,
                appSidebarEndToggled,
                appSidebarEndMobileToggled,
                toggleAppSidebarEnd,
                toggleAppSidebarEndMobile,
                handleSetAppSidebarEnd,
                handleSetAppBoxedLayout,
                handleSetAppDarkMode,
                handleSetAppGradientEnabled,
                handleSetAppTheme,
            }}
        >
            <div
                className={
                    "app " + (appClass ? appClass + ' ' : '')+
                    (appGradientEnabled ? "app-gradient-enabled " : "") +
                    (appHeaderNone ? "app-without-header " : "") +
                    (appHeaderFixed && !appHeaderNone ? "app-header-fixed " : "") +
                    (appSidebarFixed ? "app-sidebar-fixed " : "") +
                    (appSidebarNone ? "app-without-sidebar " : "") +
                    (appSidebarEnd ? "app-with-end-sidebar " : "") +
                    (appSidebarWide ? "app-with-wide-sidebar " : "") +
                    (appSidebarMinify ? "app-sidebar-minified " : "") +
                    (appSidebarMobileToggled ? "app-sidebar-mobile-toggled " : "") +
                    (appTopMenu ? "app-with-top-menu " : "") +
                    (appContentFullHeight ? "app-content-full-height " : "") +
                    (appSidebarTwo ? "app-with-two-sidebar " : "") +
                    (appSidebarEndToggled ? "app-sidebar-end-toggled " : "") +
                    (appSidebarEndMobileToggled
                        ? "app-sidebar-end-mobile-toggled "
                        : "") +
                    (hasScroll ? "has-scroll " : "")
                }
            >
                {!appHeaderNone && <Header />}
                {/* {appSidebarTwo && <SidebarRight />}
				{appTopMenu && <TopMenu />} */}
                {!appSidebarNone && <Sidebar />}
                {!appContentNone && <Content />}
            </div>
        </AppSettings.Provider>
    );
}

export default App;
