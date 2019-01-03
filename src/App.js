import React, { Component } from 'react';
import TreeMap from './Components/TreeMap/TreeMap';
import './App.css';

class App extends Component {
  state = {
    data: null,
    colors: ["gold", "salmon", "pink", "thistle", "mediumorchid", "limegreen", "cornflowerblue", "powderblue", "palevioletred", "plum", "royalblue", "mediumpurple", "darksalmon", "lightskyblue", "lightgreen", "darkgray", "lightsteelblue", "forestgreen"]
  }
  
  componentDidMount () {
    fetch('https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json')
      .then(res => res.json())
      .then(data => this.setState({data: data}))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        {this.state.data ? <TreeMap data={this.state.data} colors={this.state.colors}/> : null}
      </div>
    );
  }
}

export default App;
