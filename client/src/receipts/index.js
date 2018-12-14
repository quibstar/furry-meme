import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Popconfirm, Icon, Button } from 'antd';
import Drawer from '../drawer';
import ReceiptForm from './form';
import Network from '../services/network';
import moment from 'moment';

class Receipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      receipts: [],
    };
  }

  componentDidMount = () => {
    this.fetchReceipts();
  };

  fetchReceipts = () => {
    Network.get('/receipts', this.setReceipts);
  };

  setReceipts = res => {
    if (res && res.status === 200) {
      let receipts = res.data.receipts;
      this.setState({ receipts });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const id = this.props.match.params.id;
      if (id !== undefined) {
        // show drawer
        if (id === 'new') {
          // new form
          this.setState({ showDrawer: true, id: 'new' });
        } else {
          // edit form
          this.setState({ showDrawer: true, id: id });
        }
      } else {
        // hide drawer
        this.setState({ showDrawer: false, id: null });
      }
    }
  }

  // Animate drawer
  animateDrawer = () => {
    let state = this.state.showDrawer;
    this.setState({ showDrawer: !state });
    // this.props.history.push('/receipts');
  };

  goToIndex = () => {
    this.props.history.push('/receipts');
  };

  /**
   * Show Receipts
   */
  showReceipts = () => {
    if (this.state.receipts.length) {
      return <Table rowKey={record => record._id} dataSource={this.state.receipts} columns={this.buildColumns()} />;
    } else {
      return 'No Rreceipts';
    }
  };

  /**
   * Delete Receipt
   */
  confirm = id => {
    Network.delete('/receipts', this.deleteResponse, id);
  };

  deleteResponse = () => {
    this.fetchReceipts();
  };

  closeDrawerAndReloadView = () => {
    this.animateDrawer();
    this.fetchReceipts();
  };

  buildColumns() {
    return [
      {
        title: 'Business',
        dataIndex: 'business',
        key: 'business',
        render: (text, record) => <Link to={`/receipts/edit/${record._id}`}>{text}</Link>,
      },
      {
        key: 'category',
        title: 'Category',
        dataIndex: 'category',
      },
      {
        key: 'purchaseDate',
        title: 'Purchase Date',
        dataIndex: 'purchaseDate',
        render: (_, record) => {
          return record.purchaseDate ? moment(record.purchaseDate).format('MM/DD/YYYY') : 'N/A';
        },
      },
      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount',
        render: text => {
          return text && `$${text}`;
        },
      },
      {
        key: 'remove',
        title: 'Remove',
        render: (_, record) => (
          <Popconfirm
            title="Are you sure delete this?"
            onConfirm={() => this.confirm(record._id)}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Icon type="delete" className="delete-red" />
          </Popconfirm>
        ),
      },
    ];
  }

  render() {
    return (
      <div>
        <Link to="/receipts/new">
          <Button className="m-button" icon="plus" type="primary">
            New Receipt
          </Button>
        </Link>
        <Drawer showDrawer={this.state.showDrawer} callback={this.goToIndex}>
          <ReceiptForm id={this.state.id} closeDrawerAndReloadView={this.closeDrawerAndReloadView} />
        </Drawer>
        <h1>Receipts</h1>
        {this.showReceipts()}
      </div>
    );
  }
}
export default Receipts;
