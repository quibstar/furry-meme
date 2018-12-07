import React from 'react';
import { Button, Icon, Divider, Table, Popconfirm } from 'antd';
import Drawer from '../drawer';
import Form from './form';
import Network from '../services/network';
import NewPayment from '../payments/form';
import moment from 'moment';
import { toCurrency } from '../utilities/to-currency';

class ShowDebit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debt: '',
      showDrawer: false,
      showModal: false,
      payment: null,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      var id = this.props.match.params.id;
      if (id) {
        this.setState({ id: id }, () => {
          this.fetchDebt();
        });
      }
    }
  }

  fetchDebt = () => {
    var id = this.state.id;
    Network.get('/debts', this.setUpDebts, id);
  };

  setUpDebts = res => {
    if (res.status === 200) {
      const debt = res.data.debt;
      this.setState({ debt });
    }
  };

  debtHead() {
    if (this.state.debt) {
      var debt = this.state.debt;
      return (
        <div>
          <Button style={{ float: 'right', marginTop: '10px' }} icon="plus" type="primary" onClick={this.newPayment}>
            Payment
          </Button>

          <h1 className="float-left">{debt.name}</h1>
          <Button size="small" type="" style={{ margin: '10px 0 0 10px' }} onClick={() => this.animateDrawer()}>
            <Icon type="form" />
          </Button>
          <Popconfirm
            title="Are you sure delete this debt?"
            onConfirm={this.confirm.bind(this)}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="danger" style={{ margin: '10px 0 0 10px' }}>
              <Icon type="delete" />
            </Button>
          </Popconfirm>
        </div>
      );
    } else {
      return <h1>Debit Not found :(</h1>;
    }
  }

  handleDelete = id => {
    Network.delete('/payments', this.deletePaymentResponse, id);
  };

  deletePaymentResponse = () => {
    this.fetchDebt();
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
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        render: (text, record) => text,
      },
      {
        title: 'Paid On',
        dataIndex: 'paidOn',
        key: 'paidOn',
        render: (_, record) => {
          return record.paidOn ? moment(record.paidOn).format('MM/DD/YYYY') : 'Not Paid';
        },
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (text, record) => text,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        className: 'totals-text-right',
        render: text => {
          return toCurrency(text);
        },
      },
    ];
  }

  renderTable() {
    if (this.state.debt) {
      const debt = this.state.debt;
      let payments = debt.payments && debt.payments.length ? debt.payments.reduce((sum, p) => sum + p.amount, 0) : 0;

      let total = this.state.debt.amount - payments;
      total = toCurrency(total);

      return (
        <Table
          rowKey={record => record._id}
          dataSource={this.state.debt.payments}
          columns={this.buildColumns()}
          footer={() => (
            <div className="totals-wrap">
              <div>
                Current Due: <span className="totals">{total}</span>
              </div>
            </div>
          )}
        />
      );
    }
  }

  // drawer
  animateDrawer() {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  }

  // delete
  confirm() {
    var id = this.state.id;
    Network.delete('/debts', this.deleteResponse, id);
  }

  deleteResponse = () => {
    this.props.history.push('/debts');
  };

  editPayment = payment => {
    this.setState({ payment: payment }, () => {
      this.showModal();
    });
  };

  newPayment = () => {
    this.setState({ payment: null }, () => {
      this.showModal();
    });
  };

  showModal = () => {
    let state = this.state.showModal;
    this.setState({ showModal: !state });
  };

  renderPaymentForm = () => {
    if (this.state.debt) {
      return (
        <NewPayment
          debt={this.state.debt}
          visible={this.state.showModal}
          showModal={this.showModal}
          payment={this.state.payment}
          callback={this.fetchDebt}
        />
      );
    }
  };

  render() {
    return (
      <div>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <Form editingDebit={true} fetchDebt={this.fetchDebt} />
        </Drawer>
        {this.debtHead()}
        <Divider />
        <div>Account Number: {this.state.debt.accountNumber}</div>
        <div>Amount: {this.state.debt ? toCurrency(this.state.debt.amount) : ''}</div>
        {this.renderTable()}
        {this.renderPaymentForm()}
      </div>
    );
  }
}

export default ShowDebit;
