import React, { Component } from 'react';
import { Button, Popconfirm, Icon, Table } from 'antd';
import Form from './form';
import Drawer from '../drawer/';
import { Link } from 'react-router-dom';
import Network from '../services/network';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      tasks: [],
      editing: false,
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

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

  fetchTasks = () => {
    Network.get('/tasks', this.setTasks);
  };

  setTasks = res => {
    if (res.status === 200) {
      const tasks = res.data.tasks;
      this.setState({ tasks });
    }
  };

  // drawer
  animateDrawer() {
    this.setState({ editing: false });
    this.props.history.push('/tasks');
  }

  // delete
  confirm(id) {
    Network.delete('/tasks', this.deleteResponse, id);
  }

  deleteResponse = () => {
    this.fetchTasks();
  };

  cancel() {}

  buildColumns() {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/tasks/edit/${record.id}`}>{text}</Link>,
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
            onConfirm={() => this.confirm(record.id)}
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
        <Link to={`/tasks/new`}>
          <Button className="m-button" icon="plus" type="primary">
            New Tasks Item
          </Button>
        </Link>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <Form id={this.state.id} fetchTasks={this.fetchTasks} />
        </Drawer>
        <h1>Tasks</h1>
        {this.state.tasks && (
          <Table
            rowKey={record => record.id}
            key={'test'}
            dataSource={this.state.tasks}
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
        )}
      </div>
    );
  }
}

export default Tasks;
