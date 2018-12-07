import React, { Component } from 'react';
import { Table, Divider, Popconfirm } from '../../node_modules/antd';
import { showTotals } from './show-totals';
import moment from 'moment';

import './budgets.css';

class BudgetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: this.props.budget,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ budget: this.props.budget });
    }
  }

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
        key: 'paid',
        title: 'Paid',
        dataIndex: 'paid',
        render: record => {
          return record === true ? 'Yes' : 'No';
        },
      },
      {
        key: 'paidOn',
        title: 'Paid On',
        dataIndex: 'paidOn',
        render: (_, record) => {
          return record.paid === true ? moment(record.updated).format('MM/DD/YYYY') : 'Not Paid';
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
      fields.paid = budget ? budget.payments.map(i => i.paid) : 0;

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

  render() {
    return <div>{this.renderTable()}</div>;
  }
}

export default BudgetTable;
