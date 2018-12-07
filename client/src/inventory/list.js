import React, { Component } from 'react';
import { Popconfirm, Icon, List, Card } from 'antd';
import { Link } from 'react-router-dom';
import { toCurrency } from '../utilities/to-currency';
class InventoryList extends Component {
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

  inventoryItems = items => {
    console.log(items);
    if (items && items.length) {
      return items.map((i, idx) => {
        return <div key={idx}>{i}</div>;
      });
    }
  };

  render() {
    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4 }}
        dataSource={this.state.inventory}
        renderItem={item => (
          <List.Item>
            <Card
              title={item.name}
              actions={[
                <Link to={`/inventory/edit/${item._id}`}>
                  <Icon type="form " />
                </Link>,
                <Popconfirm
                  title="Are you sure delete this?"
                  onConfirm={() => this.confirm(item._id)}
                  onCancel={this.cancel}
                  okText="Yes"
                  cancelText="No"
                  placement="left"
                >
                  <Icon type="delete" className="delete-red" />
                </Popconfirm>,
              ]}
            >
              Quantity: {item.quantity}
              {item.unitType}. @ {toCurrency(item.pricePerUnit)} located at {item.location}
              <br />
              Model: {item.model}
              Serial Number: {item.serialNumber}
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default InventoryList;
