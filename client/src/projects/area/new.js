import React, { Component } from 'react';
import Form from './form';
class AreaNew extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>New Area</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default AreaNew;
