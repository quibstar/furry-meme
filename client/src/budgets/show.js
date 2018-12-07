import React from 'react';
import { Button, Icon, Divider, Popconfirm, Table, Menu, Dropdown } from 'antd';
import EditBudget from './edit';
import Drawer from '../drawer';
import Network from '../services/network';
import PaymentForm from '../payments/form';
import moment from 'moment';
import { showTotals } from './show-totals';
import './budgets.css';

class ShowBudget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      showModal: false,
      payment: null,
      debts: [],
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      var id = this.props.match.params.id;
      if (id) {
        this.setState({ id: id }, () => {
          this.fetchBudget();
        });
      }
    }
    Network.get('/debts', this.setUpDebts);
  }

  fetchBudget = () => {
    var id = this.state.id;
    Network.get('/budgets', this.setUpBudget, id);
  };

  setUpBudget = res => {
    const budget = res.data.budget;
    this.setState({ budget: budget });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.budget !== prevState.budget) {
      this.setState({ budget: this.state.budget });
    }
  }

  confirm() {
    var id = this.state.id;
    Network.delete('/budgets', this.deleteResponse, id);
  }

  deleteResponse = () => {
    this.props.history.push('/budgets');
  };

  cancel() {}

  budgetHead() {
    if (this.state.budget) {
      var budget = this.state.budget;
      return (
        <div>
          <h1 className="float-left">{budget.name}</h1>
          <Button size="small" type="" style={{ margin: '10px 0 0 10px' }} onClick={() => this.animateDrawer()}>
            <Icon type="form" />
          </Button>
          <Popconfirm
            title="Are you sure delete this budget?"
            onConfirm={this.confirm.bind(this)}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="danger" style={{ margin: '10px 0 0 10px' }}>
              <Icon type="delete" />
            </Button>
          </Popconfirm>

          <Button
            style={{ float: 'right', marginTop: '10px', marginRight: '20px' }}
            icon="plus"
            type="primary"
            onClick={this.newPayment}
          >
            Payment
          </Button>
          {this.debitDropDown()}
        </div>
      );
    } else {
      return <h1>Budget Not found :(</h1>;
    }
  }

  // drawer
  animateDrawer() {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  }

  showModal = () => {
    let state = this.state.showModal;
    this.setState({ showModal: !state });
  };

  editPayment = payment => {
    this.setState({ payment: payment, debt: null }, () => {
      this.showModal();
    });
  };

  newPayment = () => {
    this.setState({ payment: null, debt: null }, () => {
      this.showModal();
    });
  };

  newDebtPayment = debt => {
    this.setState({ payment: null, debt }, () => {
      this.showModal();
    });
  };

  renderPaymentForm = () => {
    if (this.state.budget) {
      return (
        <PaymentForm
          budget={this.state.budget}
          debt={this.state.debt}
          visible={this.state.showModal}
          showModal={this.showModal}
          payment={this.state.payment}
          callback={this.fetchBudget}
        />
      );
    }
  };

  handleDelete = id => {
    Network.delete('/payments', this.deletePaymentResponse, id);
  };

  deletePaymentResponse = () => {
    this.fetchBudget();
  };

  buildColumns() {
    return [
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        className: '',
        render: (text, record) => {
          return (
            <div>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record._id)}>
                <a href="javascript:;">Delete</a>
              </Popconfirm>{' '}
              <Divider type="vertical" />
              <a href="#" onClick={() => this.editPayment(record)}>
                Edit
              </a>
            </div>
          );
        },
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: text => {
          return text;
        },
      },
      {
        key: 'paidOn',
        title: 'Paid On',
        dataIndex: 'paidOn',
        render: (_, record) => {
          return record.paidOn ? moment(record.paidOn).format('MM/DD/YYYY') : 'Not Paid';
        },
      },
      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount',
        className: 'totals-text-right',
        render: text => {
          text = text.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          });
          return text;
        },
      },
    ];
  }

  renderTable() {
    if (this.state.budget) {
      let budget = this.state.budget;
      let fields = {};
      fields.amount = budget.amount;
      fields.amounts = budget ? budget.payments.map(i => i.amount) : 0;
      fields.paid = budget ? budget.payments.map(i => (i.paidOn ? true : false)) : false;

      return (
        <Table
          rowKey={record => record._id}
          pagination={false}
          rowClassName={record => (record.note === '' || record.note === undefined ? 'no-ico' : 'ico')}
          dataSource={budget.payments}
          columns={this.buildColumns()}
          expandedRowRender={record => {
            return record.note;
          }}
          footer={() => showTotals(fields)}
        />
      );
    }
  }

  budgetStatus(total) {
    if (total > 0) {
      return 'Under Budget';
    } else if (total < 0) {
      return 'Over Budget';
    } else if (total === 0) {
      return 'On Budget';
    }
  }

  // debt stuff
  debitDropDown() {
    if (this.state.debts.length) {
      const menu = (
        <Menu>
          {this.state.debts.map(d => {
            return (
              <Menu.Item key={d._id}>
                <div onClick={() => this.newDebtPayment(d)}>{d.name}</div>
              </Menu.Item>
            );
          })}
        </Menu>
      );

      return (
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button icon="plus" type="primary" style={{ float: 'right', marginTop: '10px', marginRight: '20px' }}>
            Debt
          </Button>
        </Dropdown>
      );
    }
  }

  setUpDebts = res => {
    if (res && res.status === 200) {
      const debts = res.data.debts;
      this.setState({ debts });
    }
  };

  render() {
    return (
      <div>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <EditBudget fetchBudget={this.fetchBudget.bind(this)} />
        </Drawer>
        {this.budgetHead()}
        <Divider />
        {this.renderTable()}
        {this.renderPaymentForm()}
      </div>
    );
  }
}

export default ShowBudget;
