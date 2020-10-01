import React, { Component } from "react";

export default class LoginPage extends Component {
  state = {
    email: null,
    pass: null,
    loading: false,
    error: false,
    success: false,
  };
  setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };
  getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  createLoginCookie = () => {
    var key =
      "key" + Math.floor(Math.random() * 100000000 * Math.random() * 100000000);
    this.setCookie("loginkey", key, 7);
    return key;
  };
  componentDidMount() {
    if (!this.getCookie("loginkey")) {
      this.createLoginCookie();
    }
  }

  logIn = () => {
    var email = this.state.email;
    var pass = this.state.pass;
    this.setState(
      {
        loading: true,
      },
      async () => {
        var url = window.testinDev
        ? "http://localhost/"
        : document.URL.split("?")[0];
      fetch(url +
            "app.php?q=login&email=" +
            email +
            "&pass=" +
            pass +
            "&key=" +
            this.getCookie("loginkey")
        )
          .then(async (d) => await d.json())
          .then((d) => {
            if (d.success == true) {
              this.setState(
                {
                  loading: false,
                  error: false,
                  success: true,
                },
                () => {
                  console.log("ddddd");
                  this.props.PageTo("OrdersShow");
                }
              );
            } else {
              this.setState({
                loading: false,
                error: false,
                error: true,
              });
            }
          });
      }
    );
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <form
          className="form-signin"
          style={{
            width: 300,
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            className="mb-4"
            src="https://image.flaticon.com/icons/png/512/2922/2922510.png"
            alt=""
            width={72}
            height={72}
          />
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email address"
            required
            autofocus
            onChange={(d) => {
              this.setState({
                email: d.target.value,
              });
            }}
            style={{
              marginBottom: 12,
            }}
          />
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required
            onChange={(d) => {
              this.setState({
                pass: d.target.value,
              });
            }}
            style={{
              marginBottom: 12,
            }}
          />
          {this.state.success ? (
            <div class="alert alert-success" role="alert">
              Success, Welcome admin
            </div>
          ) : (
            <div></div>
          )}
          {this.state.error ? (
            <div class="alert alert-danger" role="alert">
              email or password is uncorrect
            </div>
          ) : (
            <div></div>
          )}
          {this.state.loading ? (
            <div class="alert alert-warning" role="alert">
              loading...
            </div>
          ) : (
            <div></div>
          )}

          <button
            onClick={() => this.logIn()}
            className="btn btn-lg btn-primary btn-block"
            type="button"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }
}
