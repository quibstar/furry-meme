import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NewBudget from './new';
import { Divider, Table, Button } from '../../node_modules/antd';
import Drawer from '../drawer';
import Network from '../services/network';
import { toCurrency } from '../utilities/to-currency';
import Media from 'react-media';

class Budgets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budgets: [],
      showDrawer: false,
    };
  }

  componentDidMount() {
    this.fetchBudgets();
  }

  fetchBudgets = () => {
    Network.get('/budgets', this.getBudgets);
  };

  getBudgets = res => {
    if (res && res.status === 200) {
      const budgets = res.data.budgets;
      this.setState({ budgets });
    }
  };

  getPaidAmount(payments) {
    if (payments === undefined) {
      return 0;
    }
    let amounts = payments.map(l => l.amount);
    let paid = payments.map(l => (l.paidOn === null ? false : true));
    let paidAmount = [];
    paid.forEach((e, idx) => {
      if (e === true) {
        paidAmount.push(amounts[idx]);
      }
    });

    let paidVal = paidAmount.length ? paidAmount.reduce((sum, a) => sum + parseFloat(a), 0) : 0;
    return paidVal;
  }

  allLineItemsPaid(payments) {
    let allpaid = true;
    let paid = payments.map(l => l.paid);
    paid.forEach((e, idx) => {
      if (e !== true) {
        allpaid = false;
      }
    });
    return allpaid === true ? 'Yes' : 'No';
  }

  buildColumns() {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/budgets/${record._id}`}>{text}</Link>,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
      },

      {
        title: 'Payments',
        dataIndex: 'payments',
        key: 'payments',
        className: 'totals-text-right',
        render: record => {
          let total = record !== undefined ? this.getPaidAmount(record) : 0;
          total = toCurrency(total);
          return total;
        },
      },
      {
        title: 'Budget Amount',
        dataIndex: 'amount',
        key: 'amount',
        className: 'totals-text-right',
        render: record => {
          return toCurrency(record);
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        className: 'totals-text-right',
        render: (text, record) => {
          let total = record.amount - this.getPaidAmount(record.payments);
          total = toCurrency(total);
          return total;
        },
      },
    ];
  }

  buildResponsiveColumns() {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/budgets/${record._id}`}>{text}</Link>,
      },
    ];
  }

  renderTables = () => {
    if (this.state.budgets.length) {
      return (
        <Table
          rowKey={record => record._id}
          className={'debit-table'}
          dataSource={this.state.budgets}
          columns={this.buildColumns()}
        />
      );
    } else {
      return '';
    }
  };

  renderResponsiveTables = () => {
    if (this.state.budgets.length) {
      return (
        <Table
          rowKey={record => record._id}
          className={'debit-table'}
          dataSource={this.state.budgets}
          columns={this.buildResponsiveColumns()}
        />
      );
    } else {
      return '';
    }
  };

  animateDrawer() {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  }

  render() {
    return (
      <div>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <NewBudget fetchBudgets={this.fetchBudgets} />
        </Drawer>
        <Button type="primary" className="m-button" icon="plus" onClick={() => this.animateDrawer()}>
          New Budget
        </Button>
        <h1>Budgets</h1>

        <Media query="(min-width: 599px)">
          {matches => (matches ? this.renderTables() : this.renderResponsiveTables())}
        </Media>
      </div>
    );
  }
}

export default Budgets;

{
  /* <Media query="(min-width: 599px)">
  {matches =>
    matches
      ? this.state.inventory && <InventoryTable inventory={this.state.inventory} />
      : this.state.inventory && <InventoryList inventory={this.state.inventory} />
  }
</Media>; */
}
