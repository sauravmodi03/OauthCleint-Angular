const host = "https://localhost:7012";
const loginendpoint = "/api/Login/basic";
const singupendpoint = "/api/Register/user";

const loginapi = `${host}${loginendpoint}`;

const signupapi = `${host}${singupendpoint}`;

export {loginapi, signupapi};