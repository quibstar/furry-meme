import React, { Component } from 'react';
import {
  Divider,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Icon,
  Dropdown,
  Menu,
  Checkbox,
  Alert,
} from 'antd';
import { showTotals } from './show-totals';
import Network from '../services/network';
const FormItem = Form.Item;

let uuid = 0;
class BudgetNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: {},
      categories: [],
      debts: [],
      loading: false,
      successSavingBudget: false,
      errorSavingBudget: false,
    };
  }

  componentDidMount() {
    Network.get('/categories', this.setUpCategories);
    Network.get('/debts', this.setUpDebts);
  }

  setUpCategories = res => {
    if (res && res.status === 200) {
      const categories = res.data;
      // if category used on budget is set to true
      const cb = categories.filter(c => c.name === 'budgets');
      this.setState({ categories: cb[0].categories });
    }
  };

  setUpDebts = res => {
    if (res && res.status === 200) {
      const debts = res.data;
      this.setState({ debts });
    }
  };

  // network stuff
  loadingTrue = () => {
    this.setState({ loading: true });
  };
  loadingFalse = () => {
    this.setState({ loading: false });
  };

  networkResponse = res => {
    this.loadingFalse();
    if (res.status) {
      if (res.status === 404) {
        this.setState({ errorSavingBudget: true });
      } else if (res.status === 201 || res.status === 200) {
        this.props.fetchBudgets();
        this.setState({ successSavingBudget: true });
      }
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var budget = {};
        budget.name = values.name;
        budget.amount = parseFloat(values.amount);
        budget.category = values.category;
        this.loadingTrue();
        Network.post('/budgets', budget, this.networkResponse);
      } else {
        console.log(err);
      }
    });
  }

  closeAlert = () => {
    this.setState({ successSavingBudget: false, errorSavingBudget: false });
  };

  debitDropDown() {
    if (this.state.debts.length) {
      const menu = (
        <Menu>
          {this.state.debts.map(d => {
            return (
              <Menu.Item key={d.id}>
                <div onClick={() => this.addLineItem(d)}>{d.name}</div>
              </Menu.Item>
            );
          })}
        </Menu>
      );

      return (
        <Dropdown overlay={menu} placement="topCenter">
          <Button type="dashed" style={{ marginLeft: '10px' }}>
            Debts
          </Button>
        </Dropdown>
      );
    }
  }

  showBudgetedAmount() {
    if (this.state.budget) {
      const { getFieldsValue } = this.props.form;
      let fields = getFieldsValue();
      return showTotals(fields);
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div>
        <h1>New budget</h1>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={12}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Name cannot be blank',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <FormItem label="Budget Amount">
                {getFieldDecorator('amount', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: 'Budget Amount cannot be blank',
                    },
                  ],
                })(<InputNumber />)}
              </FormItem>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <FormItem label="Category">
                {getFieldDecorator('category', {
                  validateTrigger: ['onChange'],
                  rules: [
                    {
                      message: 'Category cannot be blank',
                    },
                  ],
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
            <Col span={1} />
          </Row>
          <Row>
            <Col span={24}>
              {this.state.successSavingBudget && (
                <Alert
                  message="Successfully save new budget"
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSavingBudget && (
                <Alert message="Error save new budget" type="error" closable afterClose={this.closeAlert} showIcon />
              )}
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" loading={this.state.loading} htmlType="submit">
              Save
            </Button>
          </FormItem>
        </Form>

        {this.showBudgetedAmount()}
      </div>
    );
  }
}

export default Form.create()(BudgetNew);
