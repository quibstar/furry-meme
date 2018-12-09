import React, { Component } from 'react';
import Form from './form';
class ProductEdit extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Edit Product</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default ProductEdit;
