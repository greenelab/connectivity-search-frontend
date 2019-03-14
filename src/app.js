import React, { Component } from "react";
import { Header } from "./header.js";
import { Key } from "./key.js";
import { Search } from "./search.js";

import "./app.css";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Key />
        <Search />
        <section>
          New technologies allow researchers to extensively profile biological
          systems, and researchers have embraced these technologies. Anyone can
          download more than 1.9 million genome-wide assays from Array Express,
          a repository of such data. Now the challenge is to understand what
          these data reveal about underlying biology. We develop and apply
          methods that extract biological principles from these data, and we
          train the next generation of biological data scientists.
        </section>
      </div>
    );
  }
}

export default App;
