import React, { useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import { useRouter } from 'next/router';
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API;

const RegisterForm = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [admin, setAdmin] = useState(false);
    const [register, setRegister] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            setRegister(false);
            setPassword("");
            setPasswordConfirm("");
            Notify.failure("Passwords are not match!");
        } else {
            const data = {
                email: email,
                password: password,
                name: name,
                gender: 1
            }
            instanceCoreApi.post(`${API}/user/register`, data).then(response => {
                console.log(response);
                setEmail("");
                setPassword("");
                setPasswordConfirm("");
                setName("");
                setRegister(true);
            }).catch(error => {
                Notify.failure(`Register failed with error!\n${error}`);
                console.log(error);
                setRegister(false);
                setPassword("");
                setPasswordConfirm("");
            })
        }
    };
    return (
        <div className="auth-form flex flex-row items-center">
            {new Date().getHours() < 12 ? (
                <div className="left-form text-right w-6/12 pr-5">
                    <h1 className="text-4xl font-bold">Good Morning!</h1>
                    <p className="leading-7 font-thin">Welcome to our service!</p>
                </div>
            ) : new Date().getHours() < 18 ? (
                <div className="left-form text-right w-6/12 pr-5">
                    <h1 className="text-4xl font-bold">Good Afternoon!</h1>
                    <p className="leading-7 font-thin">Welcome to our service!</p>
                </div>
            ) : (
                <div className="left-form text-right w-6/12 pr-5">
                    <h1 className="text-4xl font-bold">Good Evening!</h1>
                    <p className="leading-7 font-thin">Welcome to our service!</p>
                </div>
            )}
            <div className="separator w-px h-full ml-5" />
            <div className="right-form w-3/5">
                {register ? (
                    <>
                        <p
                            style={{
                                textAlign: "center",
                                fontWeight: "100",
                                marginBottom: "10px"
                            }}
                        >
                            Your account was created successfully!
                        </p>
                        <button type="button" className="h-12 bg-blue w-full font-thin text-lg" onClick={() => router.push('/login')}>Log In</button>

                    </>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col">
                            <input
                                type="text"
                                className="placeholder-gray-200 h-10 font-thin text-white"
                                id="name"
                                placeholder="Name"
                                value={name}
                                required
                                onChange={(event) => setName(event.target.value)}
                            />
                            <input
                                type="email"
                                className="placeholder-gray-200 h-10 font-thin text-white"
                                id="email"
                                placeholder="Email"
                                value={email}
                                required
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <input
                                type="password"
                                className="placeholder-gray-200 h-10 font-thin text-white"
                                id="password"
                                placeholder="New Password"
                                value={password}
                                required
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <input
                                type="password"
                                className="placeholder-gray-200 h-10 font-thin text-white"
                                id="password-confirm"
                                placeholder="Type password again"
                                required
                                value={passwordConfirm}
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                            />
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={admin}
                                    onChange={(event) => setAdmin(event.target.checked)}
                                    style={{ "display": "none" }}
                                />
                                <label htmlFor="remember-me" className="select-none cursor-pointer font-thin">
                                    <span className="inline-block align-middle relative w-6 h-6 align-middle">
                                        <svg className="absolute stroke-2" width="12px" height="9px" viewBox="0 0 12 9">
                                            <polyline points="1 5 4 8 11 1"></polyline>
                                        </svg>
                                    </span>
                                    <span className="ml-2">
                                        I am Administrator
                                    </span>
                                </label>
                            </div>

                            <button type="submit" className="h-12 bg-blue w-full font-thin text-lg">Create Account</button>
                        </form>

                        <div className="separator flex items-center text-center">Or</div>
                        <button type="button" className="h-12 bg-blue w-full font-thin text-lg" onClick={() => router.push('/login')}>Already have an account? Log In</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterForm;
