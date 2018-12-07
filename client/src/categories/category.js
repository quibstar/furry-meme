import React, { Component } from 'react';
class Category extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="item">{this.props.category}</div>;
  }
}
export default Category;
