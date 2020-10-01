import React, { Component } from "react";

export default class ChangePassword extends Component {
  state = {
    cpassword: null,
    npassword: null,
    loading: false,
    error: false,
    Done: false,
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
  update = () => {
    if (this.getCookie("loginkey")) {
      this.setState({
        loading: true,
      });
      var url = window.testinDev
        ? "http://localhost/"
        : document.URL.split("?")[0];
      fetch(
        url +
          "app.php?q=changepass&cpass=" +
          this.state.cpassword +
          "&npass=" +
          this.state.npassword +
          "&key=" +
          this.getCookie("loginkey")
      ).then(async (d) => {
        d = await d.json();
        if (d.success == false) {
          this.setState({
            error: true,
            Done: false,
            loading: false,
          });
        } else {
          this.setState(
            {
              error: false,
              Done: true,
              loading: false,
            },
            () => {
              this.props.OrdersShow();
            }
          );
        }
      });
    }
  };

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
          <h1 className="h2">Dashboard</h1>
        </div>

        <form className="mt-5">
          <div class="form-group">
            <label for="exampleFormControlInput1">currect password</label>
            <input
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              onChange={(d) => {
                this.setState({
                  cpassword: d.target.value,
                });
              }}
            />
          </div>
          <div class="form-group">
            <label for="exampleFormControlInput1">new password</label>
            <input
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              onChange={(d) => {
                this.setState({
                  npassword: d.target.value,
                });
              }}
            />
          </div>

          {this.state.loading ? (
            <div class="alert alert-warning" role="alert">
              Loading...
            </div>
          ) : (
            <span />
          )}
          {this.state.error ? (
            <div class="alert alert-danger" role="alert">
              Error, currect password is uncorrect
            </div>
          ) : (
            <div></div>
          )}
          {this.state.Done ? (
            <div class="alert alert-success" role="alert">
              Good work
            </div>
          ) : (
            <div></div>
          )}

          <button
            onClick={() => this.update()}
            type="button"
            class="btn btn-primary btn-lg btn-block"
          >
            Update
          </button>
        </form>
      </div>
    );
  }
}
