import React, { Component } from 'react';
import Form from './form';
class AreaEdit extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Edit Area</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default AreaEdit;
