import React, { Component } from "react";

export default class Setting extends Component {
  state = {
    price: null,
    StopLostPrice: null,
    error: false,
    success: false,
    autoSelling: null,
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

  componentDidMount() {
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(url + "app.php?q=getSetting&key=" + this.getCookie("loginkey"))
      .then(async (d) => {
        return await d.json();
      })
      .then((d) => {
        this.setState({
          price: d["price"],
          StopLostPrice: d["StopLostPrice"],
          autoSelling: d["autoSelling"] == "true" ? true : false,
        });
      });
  }
  update = () => {
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(
      url +
        "app.php?q=settingupload&key=" +
        this.getCookie("loginkey") +
        "&price=" +
        this.state.price +
        "&StopLostPrice=" +
        this.state.StopLostPrice +
        "&autoSelling=" +
        this.state.autoSelling
    ).then(async (d) => {
      d = await d.json();
      if (d.success) {
        this.setState({
          success: true,
        });
      } else {
        this.setState({
          error: true,
        });
      }
    });
  };

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
          <h1 className="h2">Setting</h1>
        </div>
        <form className="mt-5">
          <div class="form-group">
            <label for="exampleFormControlInput1">price</label>
            <input
              style={{
                width: "50%",
              }}
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              value={this.state.price}
              onChange={(d) => {
                this.setState({
                  price: d.target.value,
                });
              }}
            />
          </div>
          <div class="form-group">
            <label for="exampleFormControlInput1">stop loss price</label>
            <input
              style={{
                width: "50%",
              }}
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              value={this.state.StopLostPrice}
              onChange={(d) => {
                this.setState({
                  StopLostPrice: d.target.value,
                });
              }}
            />
          </div>
        </form>
        {this.state.error ? (
          <div
            class="alert alert-danger"
            style={{
              width: "50%",
            }}
            role="alert"
          >
            Error, check you the internet, or value
          </div>
        ) : (
          <div></div>
        )}
        {this.state.success ? (
          <div
            class="alert alert-success"
            style={{
              width: "50%",
            }}
            role="alert"
          >
            Good work
          </div>
        ) : (
          <div></div>
        )}
        <div class="form-group form-check">
          <input
            checked={this.state.autoSelling}
            onChange={(d) => {
              this.setState({
                autoSelling: d.target.checked,
              });
            }}
            type="checkbox"
            class="form-check-input"
            id="exampleCheck1"
          />
          <label class="form-check-label" for="exampleCheck1">
            Auto Selling
          </label>
        </div>

        <button
          onClick={() => this.update()}
          type="button"
          style={{
            width: "50%",
          }}
          class="btn btn-primary btn-lg btn-block"
        >
          update
        </button>
      </div>
    );
  }
}
