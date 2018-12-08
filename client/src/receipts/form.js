import React, { Component } from 'react';
import { Form, Input, Select, Button, Row, Col, DatePicker, InputNumber } from 'antd';
import Network from '../services/network';
import moment from 'moment';
const FormItem = Form.Item;

class ReceiptFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      receipt: null,
      loading: false,
      editing: false,
      receiptId: null,
    };
  }

  componentDidMount() {
    Network.get('/categories', this.setUpCategories);
    this.checkForId();
  }

  setUpCategories = res => {
    if (res && res.status === 200) {
      const categories = res.data;
      const cb = categories.filter(c => c.name === 'receipts');
      this.setState({ categories: cb[0].categories });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      if (this.props.id === 'new' || this.props.id === null) {
        this.setState({ editing: false, receipt: {} });
        this.props.form.resetFields();
      } else {
        this.checkForId();
      }
    }
  }

  checkForId = () => {
    const id = this.props.id;
    if (id && id !== 'new') {
      Network.get('/receipts', this.getReceipts, id);
      this.setState({ id: id });
    }
  };

  getReceipts = res => {
    if (res && res.status === 200) {
      const receipt = res.data.receipt;
      this.setState({ receipt });
      this.props.form.setFieldsValue({
        business: receipt.business,
        amount: receipt.amount,
        purchaseDate: moment(receipt.purchaseDate),
        category: receipt.category,
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    // update button
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let receipt = {};
        receipt.business = values.business;
        receipt.amount = values.amount;
        receipt.purchaseDate = values.purchaseDate.toDate();
        receipt.category = values.category;
        this.loadingTrue();
        if (this.state.id) {
          receipt._id = this.state.id;
          Network.put('/receipts', receipt, this.networkResponse);
        } else {
          // if it is new build receipt items
          Network.post('/receipts', receipt, this.networkResponse);
        }
      } else {
        console.log(err);
        this.loadingFalse();
      }
    });
  };

  // Network Stuff
  networkResponse = res => {
    this.loadingFalse();

    if (res && res.status) {
      if (res.status === 404) {
        // TODO: notification
      } else if (res.status === 201 || res.status === 200) {
        this.props.closeDrawerAndReloadView();
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
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col sm={24}>
              <FormItem label="Business">{getFieldDecorator('business', {})(<Input min={0} />)}</FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col sm={12}>
              <FormItem label="Amount">
                {getFieldDecorator('amount', {
                  validateTrigger: ['onChange'],
                  rules: [{ required: true, message: 'Amount cannot be blank' }],
                })(<InputNumber min={0} />)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="Purchase Date">
                {getFieldDecorator('purchaseDate', {
                  validateTrigger: ['onChange'],
                  rules: [{ required: true, message: 'Category cannot be blank' }],
                })(<DatePicker />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Category">
                {getFieldDecorator('category')(
                  <Select>
                    {this.state.categories.map((c, idx) => {
                      return (
                        <Select.Option key={idx} value={c}>
                          {c}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
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

export default Form.create()(ReceiptFrom);
