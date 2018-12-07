import React, { Component } from 'react';
import Form from './form';
class NewCost extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>New Cost</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default NewCost;
