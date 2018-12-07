import React, { Component } from 'react';
import { Table, Tag, Icon, Input } from 'antd';
import Network from '../services/network';
import './categories.css';

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

  postNewCategory = (id, value) => {
    let category = this.state.categories.filter(c => {
      return c._id === id;
    });
    var cat = category[0];
    cat.categories.push(value);
    Network.put('/categories', this.state.categories, this.fetchAllCategories);
  };

  handleClose = (record, value) => {
    let category = this.state.categories.filter(c => {
      return c._id === record._id;
    });
    var cat = category[0];
    var categories = cat.categories;
    categories.splice(categories.indexOf(value), 1);

    Network.put('/categories', this.state.categories, this.fetchAllCategories);
  };

  showInput = id => {
    this.setState({ inputVisible: true, currentInputId: id }, () => {
      let input = document.getElementById(`cat-${id}`);
      input.focus();
    });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const inputValue = this.state.inputValue;
    if (inputValue !== '') {
      this.postNewCategory(this.state.currentInputId, inputValue);
    }

    this.setState({
      inputVisible: false,
      inputValue: '',
      currentInputId: '',
    });
  };

  categoryTags(record) {
    return record.categories.map((c, idx) => {
      return (
        <Tag key={idx} closable={true} afterClose={() => this.handleClose(record, c)}>
          {c}
        </Tag>
      );
    });
  }

  columns() {
    return [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: text => {
          return <span className="category-name">{text}</span>;
        },
      },

      {
        key: 'categories',
        title: 'Categories',
        dataIndex: 'categories',
        render: (_, record) => {
          const { inputVisible, currentInputId } = this.state;
          return (
            <div>
              {this.categoryTags(record)}
              {inputVisible &&
                currentInputId === record._id && (
                  <Input
                    className="cat-input"
                    id={`cat-${record._id}`}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                  />
                )}
              {!inputVisible && (
                <Tag onClick={() => this.showInput(record._id)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <Icon type="plus" /> New Category
                </Tag>
              )}
            </div>
          );
        },
      },
    ];
  }
  render() {
    return (
      <div>
        <h1>Categories</h1>
        <Table
          rowKey={record => record._id}
          pagination={false}
          dataSource={this.state.categories}
          columns={this.columns()}
        />
      </div>
    );
  }
}

export default Categories;
