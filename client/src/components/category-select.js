import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class CategoryOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories,
      filterOn: this.props.filterOn,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({ categories: this.props.categories });
    }
  }

  options() {
    if (this.state.categories) {
      let cats = this.state.categories.filter(c => c.usedOn === this.state.filterOn);
      if (cats.length === 1) {
        let options = cats[0].categories;
        return options.map(option => {
          return (
            <Option key={option} value={option}>
              {option}
            </Option>
          );
        });
      }
    }
    return null;
  }
  render() {
    return <Select>{this.options()}</Select>;
  }
}
export default CategoryOptions;
