import React, { Component } from 'react';
import { Divider, Form, Select, Input, Button, Row, Col, InputNumber, Alert } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;

class DebtForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      debt: {},
      loading: false,
      successSavingDebt: false,
      errorSavingDebt: false,
      editingDebit: this.props.editingDebit,
    };
  }

  componentDidMount() {
    Network.get('/categories', this.setUpCategories);
    if (this.state.editingDebit) {
      const pathname = window.location.pathname.split('/');
      const id = pathname.pop();
      if (id) {
        Network.get('/debts', this.getDebt, id);
      }
    }
  }

  setUpCategories = res => {
    if (res.status === 200) {
      const categories = res.data;
      const cb = categories.filter(c => c.name === 'debts');
      this.setState({ categories: cb[0].categories });
    }
  };

  getDebt = res => {
    if (res.status === 200) {
      const debt = res.data.debt;
      this.setState({ debt, debt });
      this.props.form.setFieldsValue({
        name: debt.name,
        amount: debt.amount,
        accountNumber: debt.accountNumber,
        category: debt.category,
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    // update button
    this.loadingTrue();
    this.props.form.validateFields((err, values) => {
      let debt = this.state.debt;
      if (!err) {
        debt.name = values.name;
        debt.amount = parseFloat(values.amount);
        debt.category = values.category;
        debt.accountNumber = values.accountNumber;

        this.loadingTrue();
        if (this.state.editingDebit) {
          Network.put('/debts', debt, this.networkResponse);
        } else {
          Network.post('/debts', debt, this.networkResponse);
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
        this.setState({ errorSavingDebt: true });
      } else if (res.status === 201 || res.status === 200) {
        {
          this.state.editingDebit ? this.props.fetchDebt() : this.props.fetchDebts();
        }
        this.setState({ successSavingDebt: true });
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
        <h1>{this.state.editingDebit ? 'Edit Debt' : 'New Debt'}</h1>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="Debt Amount">
                {getFieldDecorator('amount', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Amount cannot be blank' }],
                })(<InputNumber />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Account Number" help="Account, loan, credit card...">
                {getFieldDecorator('accountNumber', {})(<Input />)}
              </FormItem>
            </Col>

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
          <Row>
            <Col span={24}>
              {this.state.successSavingDebt && (
                <Alert
                  message={`Successfully ${this.state.editingDebit ? 'updated' : 'saved'} debt.`}
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSavingDebt && (
                <Alert
                  message={`Error ${this.state.editingDebit ? 'updating' : 'saving'} debt.`}
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

export default Form.create()(DebtForm);
