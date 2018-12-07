import React, { Component } from 'react';
import { Form, InputNumber, Input, Button, Row, Col, Select, Divider, Alert } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;

class BudgetEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: '',
      categories: [],
      debts: [],
      uuid: 0,
      loading: false,
      successSavingBudget: false,
      errorSavingBudget: false,
    };
  }

  componentDidMount() {
    this.setState({ successSavingBudget: false, errorSavingBudget: false });
    Network.get('/categories', this.setUpCategories);
    const pathname = window.location.pathname.split('/');
    const id = pathname.pop();
    if (id) {
      Network.get('/budgets', this.getBudget, id);
    }
  }

  getBudget = res => {
    if (res && res.status === 200) {
      const budget = res.data.budget;
      this.setState({ budget, uuid: budget.payments.length });
      this.props.form.setFieldsValue({
        name: budget.name,
        amount: budget.amount,
        category: budget.category,
      });
    }
  };

  setUpCategories = res => {
    if (res && res.status === 200) {
      const categories = res.data;
      const cb = categories.filter(c => c.name === 'budgets');
      this.setState({ categories: cb[0].categories });
    }
  };

  // network stuff
  loadingTrue = () => {
    this.setState({ loading: true });
  };
  loadingFalse = () => {
    this.setState({ loading: false });
  };

  handleSubmit(e) {
    e.preventDefault();
    // update button
    this.loadingTrue();
    this.props.form.validateFields((err, values) => {
      let budget = this.state.budget;
      if (!err) {
        budget.id = budget.id;
        budget.name = values.name;
        budget.amount = parseFloat(values.amount);
        budget.category = values.category;
        this.loadingTrue();
        Network.put('/budgets', budget, this.networkResponse);
      } else {
        this.loadingFalse();
      }
    });
  }

  // Network Stuff
  networkResponse = res => {
    this.loadingFalse();
    if (res.status) {
      if (res.status === 404) {
        this.setState({ errorSavingBudget: true });
      } else if (res.status === 201 || res.status === 200) {
        this.setState({ successSavingBudget: true });
        this.props.fetchBudget();
      }
    }
  };

  loadingTrue = () => {
    this.setState({ loading: true });
  };
  loadingFalse = () => {
    this.setState({ loading: false });
  };

  closeAlert = () => {
    this.setState({ successSavingBudget: false, errorSavingBudget: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <h1>Edit Budget</h1>
        <Divider />
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label={'Name'} required={true}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'Budgeted Amount'} required={true}>
                {getFieldDecorator('amount', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Budget Amount cannot be blank' }],
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'Category'} required={true}>
                {getFieldDecorator('category', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Category cannot be blank' }],
                })(
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
              {this.state.successSavingBudget && (
                <Alert
                  message="Successfully updating new budget."
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSavingBudget && (
                <Alert
                  message="Error updating new budget."
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
              Save
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(BudgetEdit);
