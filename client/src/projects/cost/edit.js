import React, { Component } from 'react';
import Form from './form';
class EditCost extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Edit Cost</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default EditCost;
