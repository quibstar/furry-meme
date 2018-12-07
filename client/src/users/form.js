import React, { Component } from 'react';
import { Divider, Form, Select, Input, Button, Row, Col, InputNumber, Alert } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;
const Option = Select.Option;

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: ['Admin', 'User'],
      user: {},
      loading: false,
      successSaving: false,
      errorSaving: false,
      editing: this.props.editing,
    };
  }

  componentDidMount() {
    // Network.get('/roles', this.setUpRoles);
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setState({ successSaving: false, errorSaving: false });
      if (this.props.id === 'new' || this.props.id === null) {
        this.setState({ editing: false, user: {} });
        this.props.form.resetFields();
      } else {
        this.checkForId();
      }
    }
  }

  checkForId() {
    const pathname = window.location.pathname.split('/');
    const id = pathname.pop();
    if (id && id !== 'new') {
      Network.get('/users', this.getUser, id);
      this.setState({ editing: true });
    }
  }

  // setUpRoles = res => {
  //   console.log(res);
  //   if (res.status === 200) {
  //     const roles = res.data.user;
  //     this.setState({ roles: roles });
  //   }
  // };

  getUser = res => {
    if (res.status === 200) {
      const user = res.data.user;
      this.setState({ user });
      this.props.form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.role,
        workPhone: user.workPhone,
        mobilePhone: user.mobilePhone,
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    // update button
    this.loadingTrue();
    this.props.form.validateFields((err, values) => {
      let user = this.state.user;
      if (!err) {
        user.firstName = values.firstName;
        user.lastName = values.lastName;
        user.email = values.email;
        user.role = values.roles;
        user.workPhone = values.workPhone;
        user.mobilePhone = values.mobilePhone;
        this.loadingTrue();
        if (this.state.editing) {
          user.id = user.id;
          Network.put('/users', user, this.networkResponse);
        } else {
          Network.post('/users', user, this.networkResponse);
        }
      } else {
        console.log(err);
        this.loadingFalse();
      }
    });
  }

  // Network Stuff
  networkResponse = res => {
    this.loadingFalse();

    if (res && res.status) {
      if (res.status === 404 || res.status === 422) {
        this.setState({ errorSaving: true });
      } else if (res.status === 201 || res.status === 200) {
        this.props.fetchUsers();
        this.setState({ successSaving: true });
      }
    }
  };

  loadingTrue = () => {
    this.setState({ loading: true });
  };
  loadingFalse = () => {
    this.setState({ loading: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className="drawer-header-text">{this.state.editing ? 'Edit User' : 'New User'}</div>
        <Divider />
        <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="First Name">
                {getFieldDecorator('firstName', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'First name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last Name">
                {getFieldDecorator('lastName', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Last name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="email">
                {getFieldDecorator('email', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: 'Email cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Role">
                {getFieldDecorator('roles')(
                  <Select>
                    {this.state.roles.map((c, idx) => {
                      return (
                        <Option key={idx} value={c}>
                          {c}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Mobile Phone">{getFieldDecorator('mobilPhone', {})(<Input />)}</FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Work Phone">{getFieldDecorator('workPhone', {})(<Input />)}</FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {this.state.successSaving && (
                <Alert
                  message={`Successfully ${this.state.editing ? 'updated' : 'saved'} user.`}
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSaving && (
                <Alert
                  message={`Error ${this.state.editing ? 'updating' : 'saving'} user.`}
                  type="error"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
            </Col>
          </Row>

          <FormItem>
            <Button type="primary" loading={this.state.loading} htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserForm);
