import React, { Component } from "react";

export default class OrdersShow extends Component {
  state = {
    orders: [],
    names: [],
    namesS: "",
  };

  componentDidMount() {
    var Searchs = this.getCookie("Searchs");

    if (Searchs) {
      this.setState(
        {
          namesS: Searchs,
          names: Searchs.split(","),
        },
        async () => {
          this.Start();
        }
      );
    }
  }
  Start = async () => {
    await this.getOrders();
    setTimeout(() => {
      this.Start();
    }, 2500);
  };

  componentWillUnmount() {
    window.OrderChecker = undefined;
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
  eraseCookie = (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
  getOrders = () => {
    return new Promise((accept, cancel) => {
      this.state.orders = [];
      for (var i in this.state.names) {
        if (this.state.names[i] == "" || this.state.names[i] == " ") return;
        var url = window.testinDev
          ? "http://localhost/"
          : document.URL.split("?")[0];
        fetch(url + "app.php?q=getAllOrders&name=" + this.state.names[i].trim())
          .then(async (d) => {
            return await d.json();
          })
          .then((d) => {
            this.setState(
              {
                orders: [...this.state.orders, ...d],
              },
              () => {
                // console.log(this.state);
                accept();
              }
            );
          })
          .catch(() => {
            // console.log("err");
            cancel();
          });
      }
    });
  };

  cancelOrder = (id, name) => {
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(url + "app.php?q=cancelOrder&id=" + id + "&name=" + name).then(
      async (d) => {
        this.getOrders();
      }
    );
  };

  render() {
    return (
      <div>
        <input
          style={{
            color: "#000",
          }}
          value={this.state.namesS}
          class="form-control form-control-dark w-100"
          type="text"
          placeholder="Search"
          aria-label="Search"
          onChange={(d) => {
            this.setState({
              namesS: d.target.value.toUpperCase(),
            });
          }}
          onBlur={(d) => {
            var t = d.target.value.split(",");
            // console.log(t);
            this.setState(
              {
                names: t,
              },
              () => {
                this.getOrders();
              }
            );
            this.setCookie("Searchs", d.target.value, 7);
          }}
        ></input>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
          <h1 className="h2">Dashboard</h1>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>symbol</th>
                <th>orderId</th>
                <th>status</th>
                <th>side</th>
                <th>origQty</th>
                <th>price</th>
                <th>stopPrice</th>
                <th>type</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orders.reverse().map((d, ii) => {
                // console.log("here 1", d);
                if (d.status == "CANCELED" || d.status == "FILLED") return null;
                return (
                  <tr className="mt-3" key={ii}>
                    <td>{d.symbol}</td>
                    <td>{d.orderId}</td>
                    <td>{d.status}</td>
                    <td>{d.side}</td>
                    <td>{d.origQty}</td>
                    <td>{d.price}</td>
                    <td>{d.stopPrice}</td>
                    <td>{d.type}</td>
                    <td>
                      <button
                        onClick={() => this.cancelOrder(d.orderId, d.symbol)}
                        type="button"
                        class="btn btn-danger"
                      >
                        cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
