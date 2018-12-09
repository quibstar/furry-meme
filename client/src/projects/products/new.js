import React, { Component } from 'react';
import Form from './form';
class ProductNew extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>New Product</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default ProductNew;
