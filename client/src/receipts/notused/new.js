import React, { Component } from 'react';
import ReceiptForm from './form';
class NewReceipt extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <ReceiptForm {...this.props} />;
  }
}
export default NewReceipt;
