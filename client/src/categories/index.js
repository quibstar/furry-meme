import React, { Component } from 'react';
import { Tag, Icon, Input, Divider } from 'antd';
import Network from '../services/network';
import './categories.css';
import CategoryList from './category-list';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isEditing: false,
      inputValue: '',
      inputVisible: false,
      currentInputId: '',
    };
  }

  componentDidMount() {
    this.fetchAllCategories();
  }

  fetchAllCategories = () => {
    Network.get('/categories', this.responseFromFetchAllCategories);
  };

  responseFromFetchAllCategories = res => {
    if (res.status === 200) {
      const categories = res.data;
      this.setState({ categories });
    }
  };

  categoryColumns = () => {
    if (this.state.categories.length) {
      let categories = this.state.categories;

      return categories.map((category, idx) => {
        return (
          <div className="cat-col" key={idx}>
            <CategoryList id={category._id} categoryName={category.name} categories={category.categories} />
          </div>
        );
      });
    }
  };

  render() {
    return (
      <div>
        <h1>Categories</h1>
        <div id="cat-wrap">{this.categoryColumns()}</div>
      </div>
    );
  }
}

export default Categories;
