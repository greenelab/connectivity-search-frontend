import React from 'react';
import { Component } from 'react';

import { Metatypes } from './metatypes.js';
import { Header } from './header.js';
import { MetatypeFilters } from './filters.js';
import { NodeSearch } from './node-search.js';
import { NodeResults } from './node-results.js';
import { PathResults } from './path-results.js';
import './styles.css';
import './metanode-chips.css';

export class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.sourceNode = {};
    this.state.targetNode = {};

    this.state.metatypeFilters = {};
    for (const metatype of Metatypes.nodes)
      this.state.metatypeFilters[metatype] = true;

    this.updateSourceTargetNode = this.updateSourceTargetNode.bind(this);
    this.swapSourceTargetNodes = this.swapSourceTargetNodes.bind(this);
    this.toggleMetatypeFilter = this.toggleMetatypeFilter.bind(this);
  }
  updateSourceTargetNode(newState) {
    this.setState(newState);
  }
  swapSourceTargetNodes() {
    this.setState({
      sourceNode: this.state.targetNode,
      targetNode: this.state.sourceNode
    });
  }
  toggleMetatypeFilter(metatype, event) {
    const newFilters = this.state.metatypeFilters;
    if (event && event.ctrlKey) {
      let allOthersOff = true;
      for (const key of Object.keys(newFilters)) {
        if (key !== metatype && newFilters[key]) {
          allOthersOff = false;
          break;
        }
      }
      for (const key of Object.keys(newFilters)) newFilters[key] = allOthersOff;

      newFilters[metatype] = true;
    } else newFilters[metatype] = !newFilters[metatype];
    this.setState({ metatypeFilters: newFilters });
  }
  render() {
    return (
      <>
        <Header />
        <MetatypeFilters
          metatypeFilters={this.state.metatypeFilters}
          toggleMetatypeFilter={this.toggleMetatypeFilter}
        />
        <NodeSearch
          swapSourceTargetNodes={this.swapSourceTargetNodes}
          updateSourceTargetNode={this.updateSourceTargetNode}
          sourceNode={this.state.sourceNode}
          targetNode={this.state.targetNode}
          metatypeFilters={this.state.metatypeFilters}
        />
        <NodeResults
          sourceNode={this.state.sourceNode}
          targetNode={this.state.targetNode}
        />
        <PathResults
          sourceNode={this.state.sourceNode}
          targetNode={this.state.targetNode}
        />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </>
    );
  }
}

export default App;
