import React, { Component } from 'react';
import { Button } from 'antd';
import Form from './form';
import { Table } from 'antd';
import Drawer from '../drawer/';
import { Link } from 'react-router-dom';
import Network from '../services/network';
import './debt.css';
import { toCurrency } from '../utilities/to-currency';

class Debts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      debts: [],
      isEditing: false,
    };
  }

  componentDidMount() {
    this.fetchDebts();
  }

  fetchDebts = () => {
    Network.get('/debts', this.setDebts);
  };

  setDebts = res => {
    if (res.status === 200) {
      const debts = res.data.debts;
      this.setState({ debts });
    }
  };

  animateDrawer() {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  }

  buildColumns() {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/debts/${record._id}`}>{text}</Link>,
      },
      {
        key: 'account',
        title: 'Account',
        dataIndex: 'accountNumber',
      },
      {
        key: 'category',
        title: 'Category',
        dataIndex: 'category',
      },
      {
        key: 'amount',
        title: 'Initial Amount',
        dataIndex: 'amount',

        render: text => toCurrency(text),
      },
      {
        key: 'payments',
        title: 'Payments',
        dataIndex: 'payments',
        render: (text, record) => {
          if (record.payments.length === 0) {
            return `$0.00`;
          }
          let payments = record.payments ? record.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
          return payments === 0 ? '' : toCurrency(payments);
        },
      },
      {
        key: 'owed',
        title: 'Owed',
        dataIndex: 'owed',
        className: 'totals-text-right',
        render: (text, record) => {
          let payments = record.payments ? record.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
          var total = record.amount - payments;
          return toCurrency(total);
        },
      },
    ];
  }

  renderTable = () => {
    if (this.state.debts.length) {
      let total = this.state.debts.reduce((sum, d) => d.amount + sum, 0);
      total = toCurrency(total);
      return (
        <Table
          rowKey={record => record._id}
          dataSource={this.state.debts}
          columns={this.buildColumns()}
          footer={() => (
            <div className="totals-wrap debt">
              <div>
                Total Debt: <span className="totals">{total}</span>
              </div>
            </div>
          )}
        />
      );
    }
  };

  render() {
    return (
      <div>
        <Button className="m-button" icon="plus" type="primary" onClick={() => this.animateDrawer('new')}>
          New Debt
        </Button>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <Form fetchDebts={this.fetchDebts} />
        </Drawer>
        <h1>Debts</h1>
        {this.renderTable()}
      </div>
    );
  }
}

export default Debts;
