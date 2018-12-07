import React, { Component } from 'react';
import { Button, List, Card, Icon, Popconfirm } from 'antd';
import Form from './form';
import Drawer from '../drawer';
import Network from '../services/network';
import { Link } from 'react-router-dom';

import './users.css';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      users: [],
      isEditing: false,
    };
  }

  componentDidMount() {
    this.fetchUsers();
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

  fetchUsers = () => {
    Network.get('/users', this.setUsers);
  };

  setUsers = res => {
    if (res.status === 200) {
      const users = res.data.users;
      this.setState({ users });
    }
  };

  // drawer
  animateDrawer() {
    this.setState({ editing: false });
    this.props.history.push('/users');
  }

  // delete
  confirm(id) {
    Network.delete('/users', this.deleteResponse, id);
  }

  deleteResponse = () => {
    this.fetchUsers();
  };

  cancel() {}

  render() {
    return (
      <div>
        <h1>Users</h1>
        <Link to={`/users/new`}>
          <Button className="m-button" icon="plus" type="primary">
            New User
          </Button>
        </Link>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <Form id={this.state.id} fetchUsers={this.fetchUsers} />
        </Drawer>

        {this.state.users && (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4 }}
            dataSource={this.state.users}
            renderItem={user => (
              <List.Item>
                <Card
                  title={`${user.firstName} ${user.lastName}`}
                  extra={
                    <span>
                      <Link to={`/users/edit/${user._id}`}>
                        <Icon type="form" />
                      </Link>
                      <Popconfirm
                        title="Are you sure delete this task?"
                        onConfirm={() => this.confirm(user._id)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                      >
                        <Icon type="delete" className="delete-red" />
                      </Popconfirm>
                    </span>
                  }
                >
                  {user.isOwner && (
                    <div className="user-is-owner">
                      Owner:{' '}
                      <span>
                        <Icon type="check" />
                      </span>
                    </div>
                  )}
                  <div className="user-email">Email: {user.email}</div>
                  <div className="user-role">Role: {user.role}</div>
                  <div className="user-work-phone">Work Phone: {user.workPhone}</div>
                  <div className="user-mobile-phone">Mobile Phone: {user.mobilePhone}</div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

export default Users;
