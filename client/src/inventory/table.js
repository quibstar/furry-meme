import React, { Component } from 'react';
import { Popconfirm, Icon, Table } from 'antd';
import { Link } from 'react-router-dom';

class InventoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: this.props.inventory,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.inventory !== prevProps.inventory) {
      this.setState({ inventory: this.props.inventory });
    }
  }

  buildColumns() {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/inventory/edit/${record._id}`}>{text}</Link>,
      },
      {
        key: 'location',
        title: 'Location',
        dataIndex: 'location',
      },
      {
        key: 'category',
        title: 'Category',
        dataIndex: 'category',
      },
      {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
        render: (text, record) => {
          let unit = record.unitType !== undefined ? record.unitType : '';
          return `$${text} ${unit}`;
        },
      },
      {
        key: 'pricePerUnit',
        title: 'Price Per Unit',
        dataIndex: 'pricePerUnit',
        render: text => {
          return text && `$${text}`;
        },
      },
      {
        key: 'total',
        title: 'Total',
        dataIndex: 'Total',
        render: (_, record) => {
          let total = '';
          if (record.pricePerUnit && record.quantity) {
            let sum = record.pricePerUnit * record.quantity;
            total = `$${sum}`;
          }

          return total;
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
      <Table
        rowKey={record => record._id}
        key={'test'}
        dataSource={this.state.inventory}
        rowClassName={record => (record.serialNumber === '' || record.model === '' ? 'no-ico' : 'ico')}
        expandedRowRender={record => {
          return (
            <div>
              Serial Number: {record.serialNumber}
              <br />
              Model: {record.model}
            </div>
          );
        }}
        columns={this.buildColumns()}
      />
    );
  }
}

export default InventoryTable;
