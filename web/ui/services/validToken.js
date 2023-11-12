const validToken = (token) => {
    if (!token) return false;
    const payload = token.split(".")[1];
    const decodedToken = atob(payload);
    const { exp } = JSON.parse(decodedToken);
    return Date.now() <= exp * 1000;
}

export default validToken;
