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
        var payments = [];
        values.keys.forEach(k => {
          var item = {};
          item.name = values.names[k];
          item.accountNumber = values.accounts[k];
          item.amount = parseFloat(values.amounts[k]);
          item.paid = values.paid[k];
          item.note = values.notes[k];
          item.category = values.categories[k];
          payments.push(item);
        });
        budget.payments = payments;
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

  // Dynamic line items

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  addLineItem(d) {
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

    if (d) {
      setTimeout(
        function() {
          const fields = form.getFieldsValue(['keys', 'accounts', 'names']);
          let names = fields.names;
          names.pop();
          names.push(d.name);
          let accounts = fields.accounts;
          accounts.pop();
          accounts.push(d.accountNumber);

          form.setFieldsValue({
            accounts,
            names,
          });
        }.bind(this),
        50
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

    getFieldDecorator('keys', { initialValue: [] });

    const keys = getFieldValue('keys');

    const formItems = keys.map((k, idx) => {
      return (
        <div key={k}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label={'Budget Item Name'} required={false} key={`names[${k}]`}>
                {getFieldDecorator(`names[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      // required: true,
                      whitespace: true,
                      message: 'Budget item name cannot be blank.',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'Amount'} required={false} key={`amounts[${k}]`}>
                {getFieldDecorator(`amounts[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      // required: true,
                      whitespace: true,
                      message: 'Amount cannot be blank and must be numeric',
                    },
                  ],
                })(<InputNumber />)}
              </FormItem>
            </Col>

            <Col span={7}>
              <FormItem key={`paid[${k}]`} style={{ marginTop: '37px' }}>
                {getFieldDecorator(`paid[${k}]`, {
                  valuePropName: 'checked',
                })(<Checkbox>Paid</Checkbox>)}
              </FormItem>
            </Col>
            <Col span={1}>
              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                  style={{ marginTop: '55px', color: 'red' }}
                />
              ) : null}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label={'Account'} required={false} key={`accounts[${k}]`}>
                {getFieldDecorator(`accounts[${k}]`, {})(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'Category'} required={true}>
                {getFieldDecorator(`categories[${k}]`, {
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
            <Col span={8}>
              <FormItem label={'Note'} required={false} key={`notes[${k}]`}>
                {getFieldDecorator(`notes[${k}]`, {})(<Input.TextArea rows={1} />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      );
    });

    return (
      <div>
        <h1>New budget</h1>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={12}>
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

            <Col span={6}>
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

            <Col span={5}>
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
          {formItems}
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
            <Button type="dashed" onClick={() => this.addLineItem()} style={{ marginLeft: '10px' }}>
              <Icon type="plus" /> Add line item
            </Button>
            {this.debitDropDown()}
          </FormItem>
        </Form>

        {this.showBudgetedAmount()}
      </div>
    );
  }
}

export default Form.create()(BudgetNew);
