
const setToken = (token:string) => {
    localStorage.setItem("accessToken", token);
}

const getToken = () => {
    return localStorage.getItem("accessToken");
}

const removeToken = () => {
    localStorage.removeItem("accessToken");
}

export {setToken, getToken, removeToken};