import React, { Component } from "react";

export default class OrdersShow extends Component {
  state = {
    prices: {},
    Search: "",
  };

  componentDidMount() {
    window.PricesChecker = true;
    setInterval(() => {
      if (window.PricesChecker) {
        this.getPrices();
      }
    }, 1000);
  }

  componentWillUnmount() {
    window.PricesChecker = false;
  }

  getPrices = () => {
    var url = window.testinDev
      ? "http://localhost/"
      : document.URL.split("?")[0];
    fetch(url + "app.php?q=getAllPrices")
      .then(async (d) => {
        return await d.json();
      })
      .then((d) => {
        this.setState({
          prices: d,
        });
      });
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignContent: "space-evenly",
          }}
        >
          <input
            style={{
              color: "#000",
            }}
            value={this.state.Search}
            class="form-control form-control-dark w-100"
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={(d) => {
              this.setState({
                Search: d.target.value.toUpperCase(),
              });
            }}
          />
          <img
            onClick={() => this.getPrices()}
            src="https://image.flaticon.com/icons/png/512/3455/3455771.png"
            style={{
              width: 50,
              height: 50,
              cursor: "pointer",
            }}
          />
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
          <h1 className="h2">Prices</h1>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>name</th>
                <th>price</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.prices).map((d, ii) => {
                if (d.includes(this.state.Search)) {
                  return (
                    <tr className="mt-3" key={ii}>
                      <td>{d}</td>
                      <td>{this.state.prices[d]}</td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
