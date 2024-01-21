import { React } from "react";
import "./Login.css";
export default function Login(click) {
  let username = "admin";
  let password = "admin@123";

  const login = (event) => {
    event.preventDefault();
    if (
      event.target.elements.username.value == username &&
      event.target.elements.password.value == password
    ) {
      console.log("logged in");
    }
  };

  return (
    <div className="login-container">
      {" "}
      {/* <form onSubmit={login} className="login">
        <p>Login Here</p>
        <div className="input-field">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your user name"
          ></input>
        </div>
        <div className="input-field">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          ></input>
        </div>
        <div className="input-field">
          <input type="submit"></input>
        </div>
      </form> */}
    </div>
  );
}
