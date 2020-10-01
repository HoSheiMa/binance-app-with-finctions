import React, { Component } from "react";
import OrdersShow from "./Components/OrdersShow";
import CreateOrders from "./Components/CreateOrders";
import Prices from "./Components/Prices";
import LoginPage from "./Components/LoginPage";
import ChangePassword from "./Components/ChangePassword";
import Setting from "./Components/Setting";

export default class App extends Component {
  state = {
    page: "LoginPage",
    pageC: <div></div>,
    loading: true,
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

  isLogIn = async () => {
    if (this.getCookie("loginkey")) {
      var url = window.testinDev
        ? "http://localhost/"
        : document.URL.split("?")[0];
      var d = await fetch(
        url + "app.php?q=islogin&key=" + this.getCookie("loginkey")
      );
      d = await d.json();
      return d.success;
    }
    return false;
  };
  componentDidMount() {
    this.Page();

    if (!window.checker) {
      window.checker = setInterval(() => {
        var Searchs = this.getCookie("Searchs");
        if (Searchs) {
          Searchs = Searchs.split(",");
          for (var i in Searchs) {
            if (Searchs[i].trim() == "") return;
            var url = window.testinDev
              ? "http://localhost/"
              : document.URL.split("?")[0];
            fetch(
              url + "app.php?q=CheckTheMoneyStatus&name=" + Searchs[i].trim()
            )
              .then(async (d) => {
                return await d.json();
              })
              .then((d) => {
                console.log(d);
              })
              .catch((e) => {});
          }
        }
      }, 10000);
    }
  }

  logOut = async (cb) => {
    if (this.getCookie("loginkey")) {
      var url = window.testinDev
        ? "http://localhost/"
        : document.URL.split("?")[0];
      var d = await fetch(
        url + "app.php?q=logout&key=" + this.getCookie("loginkey")
      );
      cb();
    }
  };
  PageTo = (d) => {
    console.log(d);
    this.setState(
      {
        page: d,
        loading: true,
      },
      () => {
        this.Page();
      }
    );
  };
  Page = async () => {
    // console.log("Hello", await this.isLogIn());
    if ((await this.isLogIn()) == true) {
      if (this.state.page == "LoginPage") {
        this.state.page = "OrdersShow";
      }
      switch (this.state.page) {
        case "OrdersShow":
          console.log("hs");
          this.setState({
            pageC: <OrdersShow />,
          });
          break;
        case "CreateOrders":
          this.setState({
            pageC: (
              <CreateOrders OrdersShow={() => this.PageTo("OrdersShow")} />
            ),
          });

          break;
        case "Prices":
          this.setState({
            pageC: <Prices />,
          });
          break;
        case "ChangePassword":
          this.setState({
            pageC: (
              <ChangePassword OrdersShow={() => this.PageTo("OrdersShow")} />
            ),
          });
          break;
        case "Setting":
          this.setState({
            pageC: <Setting OrdersShow={() => this.PageTo("OrdersShow")} />,
          });
          break;
      }
    } else {
      this.setState({
        pageC: <LoginPage PageTo={this.PageTo} />,
        loading: false,
      });
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="nav-item"
                >
                  <a
                    className="nav-link active"
                    onClick={() => {
                      this.setState(
                        {
                          page: "OrdersShow",
                          loading: true,
                        },
                        () => {
                          this.Page();
                        }
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-home"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Dashboard <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="nav-item"
                >
                  <a
                    className="nav-link"
                    onClick={() => {
                      this.setState(
                        {
                          page: "CreateOrders",
                          loading: true,
                        },
                        () => {
                          this.Page();
                        }
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    Create orders
                  </a>
                </li>
                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="nav-item"
                >
                  <a
                    className="nav-link"
                    onClick={() => {
                      this.setState(
                        {
                          page: "Prices",
                          loading: true,
                        },
                        () => {
                          this.Page();
                        }
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    Prices
                  </a>
                </li>
                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="nav-item"
                >
                  <a
                    className="nav-link"
                    onClick={() => {
                      this.setState(
                        {
                          page: "ChangePassword",
                          loading: true,
                        },
                        () => {
                          this.Page();
                        }
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    Change Password
                  </a>
                </li>

                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="nav-item"
                >
                  <a
                    className="nav-link"
                    onClick={() => {
                      this.setState(
                        {
                          page: "Setting",
                          loading: true,
                        },
                        () => {
                          this.Page();
                        }
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    Setting
                  </a>
                </li>

                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="nav-item"
                >
                  <a
                    className="nav-link"
                    onClick={() => {
                      this.logOut(() =>
                        this.setState(
                          {
                            page: "LoginPage",
                            loading: true,
                          },
                          () => {
                            this.Page();
                          }
                        )
                      );
                    }}
                  >
                    <img
                      src="https://image.flaticon.com/icons/svg/529/529873.svg"
                      width="15"
                      style={{
                        marginRight: 5,
                      }}
                    />
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div
              className="chartjs-size-monitor"
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px",
                overflow: "hidden",
                pointerEvents: "none",
                visibility: "hidden",
                zIndex: -1,
              }}
            >
              <div
                className="chartjs-size-monitor-expand"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                  visibility: "hidden",
                  zIndex: -1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "1000000px",
                    height: "1000000px",
                    left: 0,
                    top: 0,
                  }}
                />
              </div>
              <div
                className="chartjs-size-monitor-shrink"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                  visibility: "hidden",
                  zIndex: -1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "200%",
                    height: "200%",
                    left: 0,
                    top: 0,
                  }}
                />
              </div>
            </div>
            {this.state.laading ? <div>loading...</div> : this.state.pageC}
          </main>
        </div>
      </div>
    );
  }
}
