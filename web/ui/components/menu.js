import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import Image from "next/image";
import Epaper from "@/public/logo/epaper.svg";
import Link from "next/link";
import DropDown from "./dropdown";
import { useTheme } from "next-themes";
import LightIcon from "@/assets/icons/thin/sun.svg";
import DarkIcon from "@/assets/icons/thin/moon.svg";
import DashboardIcon from "@/assets/icons/thin/dashboard.svg";
import UserIcon from "@/assets/icons/thin/human.svg";
import DataIcon from "@/assets/icons/thin/data.svg";
import DeviceIcon from "@/assets/icons/thin/device.svg";
import ExportIcon from "@/assets/icons/thin/export.svg";
import UpdateIcon from "@/assets/icons/thin/update.svg";

const navButton = [
    {
        text: "New Data",
        path: "/new-data",
        img: DataIcon,
    },
    {
        text: "New Device",
        path: "/new-device",
        img: DeviceIcon,
    },
    {
        text: "Dashboard",
        path: "/dashboard",
        img: DashboardIcon,
        subNav: [
            {
                text: "Data",
                path: "/dashboard/data",
                img: DataIcon,
            },
            {
                text: "Devices",
                path: "/dashboard/devices",
                img: DeviceIcon,
            }
        ]
    },
    {
        text: "Export",
        path: "/export",
        img: ExportIcon,
    },
    {
        text: "Batch Update",
        path: "/batch-update",
        img: UpdateIcon,
    }
];

const Menu = ({ currentPath }) => {
    const sidebar = React.createRef();
    const [width, setWidth] = useState(233);
    const [full, setFull] = useState(true);
    const [isShows, setIsShows] = useState([]);
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        let showArray = navButton.map((_) => {
            return false;
        });
        setIsShows([...showArray]);
    }, []);

    useEffect(() => {
        const updateWidth = () => {
            const container = document.querySelector('.sidebar');
            if (container) {
                setWidth(container.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    useEffect(() => {
         if (width < 233) {
            console.log(width)
            setFull(false);
        }
    }, [width]);

    const resize = () => {
        setFull(!full);
    }

    const handleMouseEnter = (button, index) => {
        if (button.subNav) {
            let showArray = [...isShows];
            showArray[index] = true;
            setIsShows([...showArray]);
        }
    };

    const handleMouseLeave = (button, index) => {
        if (button.subNav) {
            let showArray = [...isShows];
            showArray[index] = false;
            setIsShows([...showArray]);
        }
    };

    const renderThemeChanger = () => {
        if (!mounted) return null;
        const currentTheme = theme === "system" ? systemTheme : theme;

        if (currentTheme === "dark") {
            return (
                <a onClick={() => setTheme('light')} style={{ "cursor": "pointer" }}>
                    <Image src={LightIcon} alt="sun icon" className="invert dark:invert-0" />
                    <p>Light Mode</p>
                </a>
            )
        }

        else {
            return (
                <a onClick={() => setTheme('dark')} style={{ "cursor": "pointer" }}>
                    <Image src={DarkIcon} alt="moon icon" className="invert dark:invert-0" />
                    <p>Dark Mode</p>
                </a>
            )
        }
    };

    return (
         <div className={full ? `sidebar menu` : `sidebar minimal-size menu`} ref={sidebar}>
            <Navbar
                className="menu"
                light
                expand="md"
            >
                <NavbarBrand href="/" className="text-black dark:text-white logo flex items-center font-semibold text-xl">
                    <Image
                        src={Epaper}
                        alt="Epaper logo"
                        className="invert dark:invert-0 h-12 w-12"
                    />
                        Epaper
                </NavbarBrand>
                <div className="menu-bar">
                    {navButton.map((button, index) => {
                        return (
                            <Link
                                href={button.path}
                                key={index}
                                onMouseEnter={() => {
                                    handleMouseEnter(button, index);
                                }}
                                onMouseLeave={() => {
                                    handleMouseLeave(button, index);
                                }}
                                className="menu-bar-item"
                                style={{
                                    background: currentPath === button.text && "linear-gradient(145deg, #4f4f4f, #2d2d2d)",
                                    boxShadow: currentPath === button.text && "7px 7px 22px #242424, -7px -7px 22px #383838",
                                }}

                            >
                                <Image alt="" src={button.img} />
                                <p>
                                    {button.text}
                                </p>
                                {button.subNav && (
                                    <DropDown
                                        minimized={full}
                                        buttonList={button.subNav}
                                        isShow={isShows[index]}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
                <div className="menu-down flex items-center">
                    <Link 
                    href="/user"
                    className="menu-bar-item"
                    style={{
                        background: currentPath === "User" && "rgba(73, 73, 73, 0.595)",
                        marginBottom: "10px"
                    }}
                    >
                        <Image alt="an user icon" src={UserIcon} />
                        <p>
                            User
                        </p>
                    </Link>
                    {renderThemeChanger()}
                </div>
            </Navbar>
            <a className={full ? `resize-btn` : `resize-btn minimal-btn`} onClick={resize}>
                <span className="up-arrow"></span>
                <span className="down-arrow"></span>
            </a>
        </div>
    );
};

export default Menu;
