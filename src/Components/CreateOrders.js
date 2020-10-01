import React, { Component } from "react";
import Coins from "./Coins";
window.refurshPrice = null;

export default class CreateOrders extends Component {
  state = {
    type: "0",
    name: "",
    price: "",
    quantity: "",
    quantityAvalible: "",
    type_: "BUY",
    stopLimit: "",
    priceNow: null,
    error: false,
    Done: false,
    balance: {},
    msg: null,
    qPer: null,
  };

  componentDidMount() {
    this.getBalance();
  }

  setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };
  getBalance = () => {
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(url + "app.php?q=balance").then(async (d) => {
      d = await d.json();

      this.setState({
        balance: d,
      });
    });
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

  add = () => {
    this.setState({
      error: false,
      Done: false,
    });
    var data = "";
    for (var i in this.state) {
      data = data + `${i}=${this.state[i]}&`;
    }
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(url + "app.php?" + data + "q=addNewOrder").then(async (d) => {
      d = await d.json();
      if (d.success == false) {
        this.setState({
          error: true,
          Done: false,
          msg: d["res"]["code"] + " : " + d["res"]["msg"],
        });
      } else {
        this.setState(
          {
            error: false,
            Done: true,
          },
          () => {
            var Searchs = this.getCookie("Searchs");

            if (Searchs) {
              Searchs = Searchs.split(",");
              var name = this.state.name;
              if (!Searchs.includes(name)) {
                Searchs.push(name);
                Searchs = Searchs.join(",");
                this.setCookie("Searchs", Searchs, 7);
              }
            }
            this.props.OrdersShow();
          }
        );
      }
    });
  };
  Setquantity = (per) => {
    this.setState({
      qPer: per,
    });
    if (
      this.state.priceNow &&
      this.state.priceNow != "Not found this coin" &&
      this.state.balance
    ) {
      var USDT = this.state.balance["USDT"];
      console.log(USDT, this.state.priceNow, per);
      var value = (USDT / this.state.priceNow) * per;
      this.setState({
        quantity: value,
      });
    }
  };
  GetPriceNow = (name) => {
    // debugger;
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(url + "app.php?q=getAllPrices&name=" + name).then(async (d) => {
      try {
        var p = JSON.parse(await d.text()); // will return a number
        if (typeof p == "number") {
          this.setState(
            {
              priceNow: p,
              quantityAvalible:
                "   -   Avalibale: " + this.state.balance["USDT"] / p,
            },
            () => {
              if (!window.refurshPrice) {
                window.refurshPrice = setInterval(() => {
                  console.log("dd");
                  this.GetPriceNow(this.state.name);
                  // if (this.state.qPer) {
                  //   this.Setquantity(this.state.qPer);
                  // }
                }, 1000);
              }
            }
          );
        } else {
          this.setState({
            priceNow: "Not found this coin",
          });
        }
      } catch (error) {
        this.setState({
          priceNow: "Not found this coin",
        });
      }
    });
  };
  componentWillUnmount() {
    if (window.refurshPrice) {
      clearInterval(window.refurshPrice);
    }
  }
  LimitOrder = () => {
    return (
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
            onChange={(d) => {
              this.setState({
                price: d.target.value,
              });
            }}
          />
        </div>
        <label for="exampleFormControlSelect1">name</label>
        <div
          class="form-group"
          style={{
            display: "flex",
          }}
        >
          <input
            type="text"
            value={this.state.name}
            style={{
              marginRight: 10,
              width: "50%",
            }}
            class="form-control"
            id="exampleFormControlInput1"
            onChange={(d) => {
              this.setState(
                {
                  name: d.target.value.toUpperCase(),
                },
                () => {
                  this.GetPriceNow(this.state.name);
                }
              );
            }}
          />
          {this.state.priceNow ? (
            <span>
              Price: {this.state.priceNow} - {this.state.quantityAvalible}
            </span>
          ) : (
            <span />
          )}
        </div>
        <div class="btn-group mb-3" role="group" aria-label="Basic example">
          <button
            onClick={() => this.Setquantity(0.25)}
            type="button"
            class="btn btn-secondary"
          >
            25%
          </button>
          <button
            onClick={() => this.Setquantity(0.5)}
            type="button"
            class="btn btn-secondary"
          >
            50%
          </button>
          <button
            onClick={() => this.Setquantity(0.75)}
            type="button"
            class="btn btn-secondary"
          >
            75%
          </button>
          <button
            onClick={() => this.Setquantity(1)}
            type="button"
            class="btn btn-secondary"
          >
            100%
          </button>
        </div>
        <div class="form-group">
          <label for="exampleFormControlInput1">quantity</label>
          <input
            style={{
              width: "50%",
            }}
            type="number"
            class="form-control"
            id="exampleFormControlInput1"
            value={this.state.quantity}
            onChange={(d) => {
              this.setState({
                quantity: d.target.value,
              });
            }}
          />
        </div>
        <div class="form-group">
          <label for="exampleFormControlSelect1">Type select</label>
          <select
            style={{
              width: "50%",
            }}
            onChange={(d) => {
              this.setState({
                type_: d.target.value,
              });
            }}
            class="form-control"
            id="exampleFormControlSelect1"
          >
            <option value="Buy">Buy</option>
            <option value="SELL">sell</option>
          </select>
        </div>

        {this.state.error ? (
          <div
            class="alert alert-danger"
            style={{
              width: "50%",
            }}
            role="alert"
          >
            {this.state.msg}
          </div>
        ) : (
          <div></div>
        )}
        {this.state.Done ? (
          <div
            style={{
              width: "50%",
            }}
            class="alert alert-success"
            role="alert"
          >
            Good work
          </div>
        ) : (
          <div></div>
        )}

        <button
          onClick={() => this.add()}
          type="button"
          style={{
            width: "50%",
          }}
          class="btn btn-primary btn-lg btn-block"
        >
          +add
        </button>
      </form>
    );
  };
  StopLimitOrder = () => {
    this.state.type_ = "SELL";
    return (
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
            onChange={(d) => {
              this.setState({
                price: d.target.value,
              });
            }}
          />
        </div>
        <label for="exampleFormControlSelect1">name</label>
        <div
          class="form-group"
          style={{
            display: "flex",
          }}
        >
          <input
            type="text"
            value={this.state.name}
            style={{
              marginRight: 10,
              width: "50%",
            }}
            class="form-control"
            id="exampleFormControlInput1"
            onChange={(d) => {
              this.setState(
                {
                  name: d.target.value.toUpperCase(),
                },
                () => {
                  this.GetPriceNow(this.state.name);
                }
              );
            }}
          />
          {this.state.priceNow ? (
            <span>
              Price: {this.state.priceNow} - {this.state.quantityAvalible}
            </span>
          ) : (
            <span />
          )}
        </div>
        <div class="btn-group mb-3" role="group" aria-label="Basic example">
          <button
            onClick={() => this.Setquantity(0.25)}
            type="button"
            class="btn btn-secondary"
          >
            25%
          </button>
          <button
            onClick={() => this.Setquantity(0.5)}
            type="button"
            class="btn btn-secondary"
          >
            50%
          </button>
          <button
            onClick={() => this.Setquantity(0.75)}
            type="button"
            class="btn btn-secondary"
          >
            75%
          </button>
          <button
            onClick={() => this.Setquantity(1)}
            type="button"
            class="btn btn-secondary"
          >
            100%
          </button>
        </div>
        <div class="form-group">
          <label for="exampleFormControlInput1">quantity</label>
          <input
            style={{
              width: "50%",
            }}
            type="number"
            class="form-control"
            id="exampleFormControlInput1"
            value={this.state.quantity}
            onChange={(d) => {
              this.setState({
                quantity: d.target.value,
              });
            }}
          />
        </div>
        <div class="form-group">
          <label for="exampleFormControlInput1">stop Limit</label>
          <input
            style={{
              width: "50%",
            }}
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            onChange={(d) => {
              this.setState({
                stopLimit: d.target.value,
              });
            }}
          />
        </div>

        {this.state.error ? (
          <div
            class="alert alert-danger"
            style={{
              width: "50%",
            }}
            role="alert"
          >
            Error, check you balance or the internet, or the name of the coin
          </div>
        ) : (
          <div></div>
        )}
        {this.state.Done ? (
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

        <button
          onClick={() => this.add()}
          type="button"
          style={{
            width: "50%",
          }}
          class="btn btn-primary btn-lg btn-block"
        >
          +add
        </button>
      </form>
    );
  };

  TypeSwitch = () => {
    switch (this.state.type) {
      case "0":
        return this.LimitOrder();
        break;
      case "1":
        return this.StopLimitOrder();
        break;
    }
  };
  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
          <h1 className="h2">Dashboard</h1>
        </div>
        <div>
          <span>Your Balance</span>
        </div>
        {Object.keys(this.state.balance).map((d) => {
          return (
            <div>
              <span>
                {d} : {this.state.balance[d]}
              </span>
            </div>
          );
        })}
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="exampleRadios"
            id="exampleRadios1"
            defaultChecked
            onClick={(d) => {
              this.setState({
                type: d.target.value,
              });
            }}
            value="0"
          />
          <label class="form-check-label" for="exampleRadios1">
            LIMIT order
          </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="exampleRadios"
            id="exampleRadios2"
            value="1"
            onClick={(d) => {
              this.setState({
                type: d.target.value,
              });
            }}
          />
          <label class="form-check-label" for="exampleRadios2">
            STOP LOSS order
          </label>
        </div>
        {this.TypeSwitch()}
      </div>
    );
  }
}
