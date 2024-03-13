
const initSession = (email:string, token:string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("email", email);
}

const getToken = () => {
    return localStorage.getItem("accessToken");
}

const getEmail = () =>{ 
    return localStorage.getItem("email");
}

const invalidateSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
}

export {initSession, getToken, getEmail, invalidateSession};