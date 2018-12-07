import React, { Component } from 'react';
import { Divider, Form, Select, Input, Button, Row, Col, InputNumber, Alert } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;
const Option = Select.Option;

class InventoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      inventory: {},
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
        this.setState({ editing: false, inventory: {} });
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
      Network.get('/inventory', this.getInventory, id);
      this.setState({ editing: true });
    }
  }

  setUpCategories = res => {
    if (res && res.status === 200) {
      const categories = res.data;
      const cb = categories.filter(c => c.name === '/inventory');
      this.setState({ categories: cb[0].categories });
    }
  };

  getInventory = res => {
    if (res && res.status === 200) {
      const inventory = res.data.inventory;
      this.setState({ inventory });
      this.props.form.setFieldsValue({
        name: inventory.name,
        model: inventory.model,
        serialNumber: inventory.serialNumber,
        category: inventory.category,
        pricePerUnit: inventory.pricePerUnit,
        quantity: inventory.quantity,
        location: inventory.location,
        unitType: inventory.unitType,
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    // update button
    this.loadingTrue();
    this.props.form.validateFields((err, values) => {
      let inventory = this.state.inventory;
      if (!err) {
        inventory.name = values.name;
        inventory.model = values.model;
        inventory.category = values.category;
        inventory.serialNumber = values.serialNumber;
        inventory.quantity = values.quantity || 0;
        inventory.pricePerUnit = values.pricePerUnit || 0;
        inventory.location = values.location;
        inventory.unitType = values.unitType;

        this.loadingTrue();
        if (this.state.editing) {
          Network.put('/inventory', inventory, this.networkResponse);
        } else {
          Network.post('/inventory', inventory, this.networkResponse);
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
        this.props.fetchInventory();
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
        <h1>{this.state.editing ? 'Edit Inventory' : 'New Inventory'}</h1>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <FormItem label="Model">{getFieldDecorator('model', {})(<Input />)}</FormItem>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <FormItem label="Serial Number">{getFieldDecorator('serialNumber', {})(<Input />)}</FormItem>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <FormItem label="Location">{getFieldDecorator('location', {})(<Input />)}</FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
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
            <Col xs={24} sm={12} md={6}>
              <FormItem label="Price Per Unit">
                {getFieldDecorator('pricePerUnit', {})(<InputNumber min={0} />)}
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <FormItem label="Quantity">{getFieldDecorator('quantity', {})(<InputNumber min={0} />)}</FormItem>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <FormItem label="Units Of Measure">
                {getFieldDecorator('unitType')(
                  <Select>
                    {['ea', 'bx', 'pc', 'case', 'pallet', 'lb', 'ft', 'yds', 'pt', 'qt', 'l', 'gal'].map((c, idx) => {
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
                  message={`Successfully ${this.state.editing ? 'updated' : 'saved'} inventory.`}
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSaving && (
                <Alert
                  message={`Error ${this.state.editing ? 'updating' : 'saving'} inventory.`}
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

export default Form.create()(InventoryForm);
