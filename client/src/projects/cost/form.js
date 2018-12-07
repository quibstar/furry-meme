import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Icon, Select } from 'antd';
import Network from '../../services/network';

const FormItem = Form.Item;
const Option = Select.Option;
let id = 0;

class CostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      projectId: this.props.projectId,
      areaId: this.props.areaId,
      costId: null,
    };
  }

  componentDidMount = () => {
    // for editing
    if (this.props.costId) {
      this.getCost();
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.showDrawer === false && this.props.costId === null) {
      this.props.form.resetFields();
    }
    if (this.props.costId !== prevProps.costId && this.props.costId !== null) {
      console.log('test');
      this.getCost();
    }
  };

  getCost = id => {
    var id = this.props.projectId + '==' + this.props.areaId + '==' + this.props.costId;
    Network.get('/area-cost/' + id, this.setCost);
  };

  setCost = res => {
    if (res && res.status === 200) {
      let c = res.data.cost;
      this.setState({ costId: c._id });
      this.props.form.setFieldsValue({
        material: c.material,
        location: c.location,
        pricePerUnit: c.pricePerUnit,
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        let cost = {};
        cost.material = values.material;
        cost.location = values.location;
        cost.pricePerUnit = values.pricePerUnit;
        cost.ids = this.props.projectId + '==' + this.props.areaId;
        if (this.state.costId) {
          cost._id = this.state.costId;
          Network.put('/area-cost', cost, this.networkResponse);
        } else {
          Network.post('/area-cost', cost, this.networkResponse);
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
        this.props.callback(this.props.form);
      }
    }
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label={'Material'} required={true}>
                {getFieldDecorator('material', {
                  rules: [{ required: true, message: 'Material cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label={'Location/URL'}>{getFieldDecorator('location', {})(<Input />)}</FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={'Price per unit'} required={true}>
                {getFieldDecorator('pricePerUnit', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Price per unit cannot be blank' }],
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
export default Form.create()(CostForm);
