import React, { Component } from 'react';
import { Divider, Form, Input, Button, Row, Col, Icon, Alert } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;

let uuid = 0;
class ListForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {},
      loading: false,
      successSaving: false,
      errorSaving: false,
      editing: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setState({ successSaving: false, errorSaving: false });
      if (this.props.id === 'new' || this.props.id === null) {
        this.setState({ editing: false, list: {} });
        this.props.form.resetFields();
      } else {
        this.checkForId();
      }
    }
  }

  checkForId() {
    const pathname = window.location.pathname.split('/');
    const id = pathname.pop();
    if (id && id !== 'new') {
      Network.get('/lists', this.getList, id);
      this.setState({ editing: true });
    }
  }

  getList = res => {
    if (res.status === 200) {
      const list = res.data.list;
      this.setState({ list });
      this.props.form.setFieldsValue({
        name: list.name,
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    // update button

    this.props.form.validateFields((err, values) => {
      let list = this.state.list;
      // empty the array
      list.listItems = [];
      if (!err) {
        list.name = values.name;

        // var lineItems = [];
        values.keys.forEach(k => {
          var item = {};
          item.name = values.names[k];
          // if (this.state.editing) {
          //   item._id = values.ids[k];
          // }
          item.done = values.done[k] !== undefined ? values.done[k] : false;
          list.listItems.push(item);
        });
        // list.lineItems = lineItems;
        this.loadingTrue();
        if (this.state.editing) {
          Network.put('/lists', list, this.networkResponse);
        } else {
          // if it is new build list items
          Network.post('/lists', list, this.networkResponse);
        }
      } else {
        console.log(err);
        this.loadingFalse();
      }
    });
  }

  // Network Stuff
  networkResponse = res => {
    this.loadingFalse();

    if (res.status) {
      if (res.status === 404) {
        this.setState({ errorSaving: true });
      } else if (res.status === 201 || res.status === 200) {
        this.props.fetchLists();
        this.setState({ successSaving: true });
      }
    }
  };

  loadingTrue = () => {
    this.setState({ loading: true });
  };
  loadingFalse = () => {
    this.setState({ loading: false });
  };

  // dynamic fields
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    var items = this.state.list.listItems;
    var editing = this.state.editing;
    if (this.state.editing && this.state.list.listItems) {
      uuid = this.state.list.listItems.length;
      getFieldDecorator('keys', { initialValue: this.state.list.listItems.map((i, idx) => idx) });
    } else {
      getFieldDecorator('keys', { initialValue: [] });
    }

    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Row key={k}>
          <Col span={16}>
            <FormItem label={index === 0 ? 'List item(s)' : ''} required={false} key={k}>
              {getFieldDecorator(`names[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please input list item or delete this field.',
                  },
                ],
                initialValue: editing ? (items[k] ? items[k].name : undefined) : undefined,
              })(<Input placeholder="List Item" style={{ width: '60%', marginRight: 8 }} />)}
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            </FormItem>

            {getFieldDecorator(`ids[${k}]`, {
              initialValue: editing ? (items[k] ? items[k].id : undefined) : undefined,
            })(<Input type="hidden" />)}

            {getFieldDecorator(`done[${k}]`, {
              initialValue: editing ? (items[k] ? items[k].done : undefined) : undefined,
            })(<Input type="hidden" />)}
          </Col>
        </Row>
      );
    });
    return (
      <div>
        <h1>{this.state.editing ? 'Edit List' : 'New List'}</h1>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {formItems}
            <Col span={24}>
              {this.state.successSaving && (
                <Alert
                  message={`Successfully ${this.state.editing ? 'updated' : 'saved'} list.`}
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSaving && (
                <Alert
                  message={`Error ${this.state.editing ? 'updating' : 'saving'} list.`}
                  type="error"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
            </Col>
          </Row>
          <FormItem>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Add List Item
            </Button>
            <Divider />
            <Button type="primary" loading={this.state.loading} htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ListForm);
