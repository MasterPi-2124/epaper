import React, { useState } from "react";
import { useRouter } from 'next/router';
import { instanceCoreApi } from "@/services/setupAxios";
import Cookies from "universal-cookie";
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API;
const cookies = new Cookies();

const LogInForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            email: email,
            password: password
        }
        console.log(data);

        instanceCoreApi.post(`${API}/user/login`, data).then(response => {
            console.log(response);
            setEmail("");
            setPassword("");
            setRememberMe(false);
            cookies.set("TOKEN", response.data.data.token, {
                path: "/"
            })
            router.push('/dashboard');
        }).catch(error => {
            console.log(error);
            setPassword("");
            Notify.failure("Email or password is incorrect!");
        })
    };
    return (
        <div className="auth-form flex flex-row items-center">
            {new Date().getHours() < 12 ? (
                <div className="left-form text-right w-6/12 pr-5">
                    <h1 className="text-4xl font-bold">Good Morning!</h1>
                    <p className="leading-7 font-thin">Hope you bring pizza!</p>
                </div>
            ) : new Date().getHours() < 18 ? (
                <div className="left-form text-right w-6/12 pr-5">
                    <h1 className="text-4xl font-bold">Good Afternoon!</h1>
                    <p className="leading-7 font-thin">How is it going?</p>
                </div>
            ) : (
                <div className="left-form text-right w-6/12 pr-5">
                    <h1 className="text-4xl font-bold">Good Evening!</h1>
                    <p className="leading-7 font-thin">How is your day?</p>
                </div>
            )}
            <div className="separator w-px h-full ml-5" />
            <div className="right-form w-3/5">
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col authen-form">
                    <input
                        type="email"
                        className="placeholder-gray-200 h-10 font-thin text-white"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <input
                        type="password"
                        className="placeholder-gray-200 h-10 font-thin text-white"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <div>
                        <input
                            type="checkbox"
                            id="remember-me"
                            checked={rememberMe}
                            onChange={(event) => setRememberMe(event.target.checked)}
                            style={{ "display": "none" }}
                        />
                        <label htmlFor="remember-me" className="select-none cursor-pointer font-thin">
                            <span className="inline-block align-middle relative w-6 h-6 align-middle">
                                <svg className="absolute stroke-2" width="12px" height="9px" viewBox="0 0 12 9">
                                    <polyline points="1 5 4 8 11 1"></polyline>
                                </svg>
                            </span>
                            <span className="ml-2">
                                Remember Me
                            </span>
                        </label>
                    </div>
                    <button type="submit" className="h-12 w-full font-thin text-lg">Sign In</button>
                </form>

                <div className="separator flex items-center text-center">Or</div>
                <button type="button" className="h-12 w-full font-thin text-lg" onClick={() => router.push('/register')}>Don&apos;t have an account? Sign Up</button>
                <a className="forgot block font-thin text-center underline w-full">Forgot your password?<br/>Sorry I can&apos;t help, I&apos;m even not a button lol</a>
            </div>


        </div>
    );
};

export default LogInForm;
