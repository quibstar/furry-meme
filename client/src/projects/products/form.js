import React, { Component } from 'react';
import { Form, Row, Col, Button, Input, InputNumber, Select } from 'antd';
import Network from '../../services/network';
const FormItem = Form.Item;
const Option = Select.Option;

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      project: this.props.project,
      productId: this.props.productId,
      isEditing: false,
    };
  }

  componentDidUpdate = prevProps => {
    // this.props.form.resetFields();
    // console.log(this.props.product !== null, !this.state.isEditing);
    if (this.props.product !== null && this.props.product !== undefined && !this.state.isEditing) {
      this.setState({ isEditing: true });
      this.props.form.setFieldsValue({
        name: this.props.product.name,
        quantity: this.props.product.quantity,
        unit: this.props.product.unit,
        price: this.props.product.price,
      });
    }
    if (this.props.project === null && this.state.isEditing) {
      this.setState({ isEditing: false });
      this.props.form.resetFields();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        let product = {};
        product.name = values.name;
        product.quantity = values.quantity;
        product.unit = values.unit;
        product.price = values.price;
        product.total = values.quantity * values.price;
        product.projectId = this.state.project._id;
        if (this.state.isEditing) {
          product._id = this.props.product._id;
          Network.put('/project-product', product, this.networkResponse);
        } else {
          Network.post('/project-product', product, this.networkResponse);
        }
      } else {
        // TODO: FIX THIS
      }
    });
  };

  // Network Stuff
  networkResponse = res => {
    if (res && res.status) {
      if (res.status === 404) {
      } else if (res.status === 201 || res.status === 200) {
        this.props.form.resetFields();
        this.props.callback();
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={4}>
            <Col>
              <FormItem label={'Name'} required={true}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={4}>
            <Col xs={24} sm={8}>
              <FormItem label={'Quantity'}>
                {getFieldDecorator('quantity', {
                  rules: [{ required: true, message: 'Quantity cannot be blank' }],
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col xs={24} sm={8}>
              <FormItem label={'Unit'} required={true}>
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: 'Unit(s) cannot be blank' }],
                })(
                  <Select>
                    {['ea.', 'bx.', 'pc.', 'case', 'pallet', 'lb.', 'ft.', 'yds.', 'pt.', 'qt.', 'l.', 'gal.'].map(
                      (c, idx) => {
                        return (
                          <Option key={idx} value={c}>
                            {c}
                          </Option>
                        );
                      }
                    )}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={24} sm={8}>
              <FormItem label={'Price'} required={true}>
                {getFieldDecorator('price', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Price cannot be blank' }],
                })(<InputNumber />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" loading={this.state.loading} htmlType="submit">
              Save
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ProductForm);
