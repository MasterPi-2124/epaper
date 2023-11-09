import { Drawer, Space } from 'antd';
import { MenuOutlined, CloseOutlined } from "@ant-design/icons"
import { NavbarBrand } from "reactstrap";
import Image from "next/image";
import { useState } from 'react';
import CNWeb from "../assets/logo/cnweb-30.png";
import Link from "next/link";

const DrawerMenu = ({ navButton }) => {
    const [show, setShow] = useState(false)

    const handleClick = () => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    return (
        <div>
            <button
                onClick={handleClick}
                style={{
                    color: "black",
                    backgroundColor: "transparent",
                    fontSize: "1.25rem"
                }}
            >
                <MenuOutlined />
            </button>
            <Drawer
                title={(
                    <div style={{ display: "flex", gap: "5px" }}>
                        <Image src={Notional} height={40} width={40} alt="notional logo" />
                        <NavbarBrand style={{ color: "#c4181a", fontWeight: "600", fontSize: "22px", position: "relative", top: "10px" }} href="/">
                            Notional
                        </NavbarBrand>
                    </div>
                )}
                placement="left"
                onClose={handleClose}
                open={show}
                width={"100%"}
                extra={
                    <Space>
                        <button onClick={handleClose} style={{
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "1.25rem",
                            position: "relative",
                            top: "-1px"
                        }}>
                            <CloseOutlined />
                        </button>
                    </Space>
                }
            >
                {
                    navButton.map((button, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    width: "100%",
                                    margin: "10px 0",
                                }}
                            >
                                {
                                    !button.subNav ? (
                                        <Link
                                            href={button.path}
                                            className="nav-button"
                                            style={{
                                                color: "black",
                                                fontSize: "1.25rem",
                                            }}
                                        >
                                            {button.text}
                                        </Link>
                                    ) : (
                                        <div>
                                            <Link
                                                href={button.path}
                                                className="nav-button"
                                                style={{
                                                    color: "black",
                                                    fontSize: "1.25rem",
                                                    margin: "10px 0",
                                                }}
                                            >
                                                {button.text}
                                            </Link>
                                            <div>
                                                <ul
                                                    style={{
                                                        padding: 0,
                                                        margin: 0,
                                                        textAlign: "left",
                                                        fontSize: "1rem",
                                                    }}
                                                >
                                                    {button.subNav.map((button, index) => {
                                                        return (
                                                            <li
                                                                key={index}
                                                                style={{
                                                                    margin: "0 2rem",
                                                                }}
                                                                className="sub-nav-li"
                                                            >
                                                                <Link href={button.path} className="nav-button">
                                                                    {button.text}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })}
            </Drawer>
        </div>
    )
}

export default DrawerMenu