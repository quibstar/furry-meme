import React, { Component } from 'react';
import { Divider, Form, Select, Input, Button, Row, Col, InputNumber, Alert } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;
const Option = Select.Option;

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      task: {},
      loading: false,
      successSaving: false,
      errorSaving: false,
      editing: this.props.editing,
    };
  }

  componentDidMount() {
    Network.get('/categories', this.setUpCategories);
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setState({ successSaving: false, errorSaving: false });
      if (this.props.id === 'new' || this.props.id === null) {
        this.setState({ editing: false, task: {} });
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
      Network.get('/task', this.getTask, id);
      this.setState({ editing: true });
    }
  }

  setUpCategories = res => {
    if (res && res.status === 200) {
      const categories = res.data;
      const cb = categories.filter(c => c.name === 'tasks');
      this.setState({ categories: cb[0].categories });
    }
  };

  getTask = res => {
    if (res && res.status === 200) {
      const task = res.data;
      this.setState({ task });
      this.props.form.setFieldsValue({
        name: task.name,
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    // update button
    this.loadingTrue();
    this.props.form.validateFields((err, values) => {
      let task = this.state.task;
      if (!err) {
        task.name = values.name;

        this.loadingTrue();
        if (this.state.editing) {
          task.id = task.id;
          Network.put('/task', task, this.networkResponse);
        } else {
          Network.post('/task', task, this.networkResponse);
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
        this.props.fetchTasks();
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <h1>{this.state.editing ? 'Edit Task' : 'New Task'}</h1>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Category">
                {getFieldDecorator('category')(
                  <Select>
                    {this.state.categories.map((c, idx) => {
                      return (
                        <Option key={idx} value={c}>
                          {c}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label="Price Per Unit">
                {getFieldDecorator('pricePerUnit', {})(<InputNumber min={0} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Quantity">{getFieldDecorator('quantity', {})(<InputNumber min={0} />)}</FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Units Of Measure">
                {getFieldDecorator('unitType')(
                  <Select>
                    {['ea', 'pc', 'case', 'pallet', 'lb', 'ft', 'yds', 'pt', 'qt', 'l', 'gal'].map((c, idx) => {
                      return (
                        <Option key={idx} value={c}>
                          {c}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {this.state.successSaving && (
                <Alert
                  message={`Successfully ${this.state.editing ? 'updated' : 'saved'} task.`}
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSaving && (
                <Alert
                  message={`Error ${this.state.editing ? 'updating' : 'saving'} task.`}
                  type="error"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
            </Col>
          </Row>

          <FormItem>
            <Button type="primary" loading={this.state.loading} htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(TaskForm);
