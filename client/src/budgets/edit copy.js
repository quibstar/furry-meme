import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Icon,
  InputNumber,
  Checkbox,
  Select,
  Divider,
  Menu,
  Dropdown,
  Alert,
  message,
} from 'antd';
import { showTotals } from './show-totals';
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
    Network.get('/debts', this.setUpDebts);

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

  setUpDebts = res => {
    if (res && res.status === 200) {
      const debts = res.data.debts;
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
        var payments = [];
        values.keys.forEach(k => {
          var item = {};
          item.name = values.names[k];
          item.accountNumber = values.accounts[k];
          item.amount = parseFloat(values.amounts[k]);
          item.paid = values.paid[k];
          item.note = values.notes[k];
          item.category = values.categories[k];
          item.debtId = values.debtIds[k];
          item._id = values.paymentIds[k];
          payments.push(item);
        });
        budget.payments = payments;
        this.loadingTrue();
        Network.put('/budgets', budget, this.networkResponse);
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

  // dynamic fields
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });

    // check and see if line item is a debt item and remove payment if there is
    // a payment id
    let payments = this.state.budget.payments;
    if (payments[k].paymentId) {
      const id = payments[k].paymentId;
      Network.delete('/payments', this.deleteLineItemResponse, id);
    }
  };

  deleteLineItemResponse = () => {
    message.success('Debt payment record removed');
  };

  addLineItem(d) {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    let uuid = this.state.uuid;
    const nextKeys = keys.concat(uuid);
    uuid++;
    this.setState({ uuid });
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });

    if (d) {
      setTimeout(
        function() {
          const fields = form.getFieldsValue(['keys', 'accounts', 'names', 'debtIds', 'paymentIds']);
          let names = fields.names;
          // remove blank name from names fields
          names.pop();
          // push debt name
          names.push(d.name);

          let accounts = fields.accounts;
          // remove blank account from accounts
          accounts.pop();
          // push debt account number
          accounts.push(d.accountNumber);

          let debtIds = fields.debtIds;
          // remove blank account from accounts
          debtIds.pop();
          // push debt account number
          debtIds.push(d._id);

          form.setFieldsValue({
            accounts,
            names,
            debtIds,
          });
        }.bind(this),
        50
      );
    }
  }

  debitDropDown() {
    if (this.state.debts.length) {
      const menu = (
        <Menu>
          {this.state.debts.map(d => {
            return (
              <Menu.Item key={d._id}>
                <div onClick={() => this.addLineItem(d)}>{d.name}</div>
              </Menu.Item>
            );
          })}
        </Menu>
      );

      return (
        <Dropdown overlay={menu} placement="topCenter">
          <Button type="dashed" style={{ marginLeft: '10px' }}>
            <Icon type="plus" /> Debt
          </Button>
        </Dropdown>
      );
    }
  }

  setDynamicFields() {
    if (this.state.budget) {
      var payments = this.state.budget.payments;
      console.log(payments);
      const { getFieldDecorator, getFieldValue } = this.props.form;
      getFieldDecorator('keys', { initialValue: payments.map((i, idx) => idx) });
      const keys = getFieldValue('keys');

      return keys.map(k => {
        console.log(payments[k]);
        return (
          <div key={k}>
            <Row gutter={16}>
              <Col span={8}>
                <FormItem label={'Name'} required={true} key={`names[${k}]`}>
                  {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: 'Budget name cannot be blank.',
                      },
                    ],
                    initialValue: payments[k] ? payments[k].name : undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'Amount'} required={true} key={`amounts[${k}]`}>
                  {getFieldDecorator(`amounts[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: 'Amount cannot be blank',
                      },
                    ],
                    initialValue: payments[k] ? payments[k].amount : 0,
                  })(<InputNumber precision={2} />)}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem key={`paid[${k}]`} style={{ marginTop: '37px' }}>
                  {getFieldDecorator(`paid[${k}]`, {
                    valuePropName: 'checked',
                    initialValue: payments[k] ? payments[k].paid : false,
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
                  {getFieldDecorator(`accounts[${k}]`, {
                    initialValue: payments[k] ? payments[k].accountId : undefined,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'Category'} required={true}>
                  {getFieldDecorator(`categories[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: 'Category cannot be blank' }],
                    initialValue: payments[k] ? payments[k].category : undefined,
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
              <Col span={7}>
                <FormItem label={'Note'} required={false} key={`notes[${k}]`}>
                  {getFieldDecorator(`notes[${k}]`, { initialValue: payments[k] ? payments[k].note : undefined })(
                    <Input.TextArea rows={1} />
                  )}
                </FormItem>

                <FormItem label={'debtId'} key={`debtId[${k}]`}>
                  {getFieldDecorator(`debtIds[${k}]`, { initialValue: payments[k] ? payments[k].debtId : undefined })(
                    <Input rows={1} />
                  )}
                </FormItem>

                <FormItem label={'paymentId'} key={`paymentId[${k}]`}>
                  {getFieldDecorator(`paymentIds[${k}]`, {
                    initialValue: payments[k] ? payments[k]._id : undefined,
                  })(<Input rows={1} />)}
                </FormItem>
              </Col>
            </Row>
            <Divider />
          </div>
        );
      });
    }
  }

  // calculations
  showBudgetedAmount() {
    if (this.state.budget) {
      const { getFieldsValue } = this.props.form;
      let fields = getFieldsValue();
      return showTotals(fields);
    }
  }

  // dynamicCategory(value) {
  //   console.log(value);
  // }

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
                })(<Input />)}
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
          <Divider />
          <Row>{this.setDynamicFields()}</Row>
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

export default Form.create()(BudgetEdit);
