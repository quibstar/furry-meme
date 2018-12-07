import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Checkbox, Alert } from 'antd';
import Network from '../services/network';
import './auth.css';

const FormItem = Form.Item;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      successRegisteringAccount: false,
      errorRegisteringAccount: false,
      serverErrors: '',
      serverSuccess: '',
      toDashboard: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const account = {
          account: values.name,
          name: values.name,
          email: values.email,
          password: values.password,
        };

        this.loadingTrue();
        Network.post('/signup', account, this.networkResponse);
      }
    });
  };

  // network stuff
  loadingTrue = () => {
    this.setState({ loading: true });
  };
  loadingFalse = () => {
    this.setState({ loading: false });
  };

  networkResponse = res => {
    this.loadingFalse();
    if (res.status) {
      if (res.status === 500) {
        this.setState({ errorRegisteringAccount: true, serverErrors: res.data.toString() });
      } else if (res.status === 201 || res.status === 200) {
        // save to local storage
        localStorage.setItem('token', res.data.token);
        this.setState({
          successRegisteringAccount: true,
          errorRegisteringAccount: false,
          serverSuccess: 'Successfully created account',
        });
        window.location.href = '/dashboard';
      }
    }
  };
  closeAlert = () => {
    this.setState({ successRegisteringAccount: false, errorRegisteringAccount: false });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} id="registration-form">
        <FormItem {...formItemLayout} label="Account Name">
          {getFieldDecorator('account', {
            rules: [
              {
                required: true,
                message: 'Please choose an account name',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please fill in your name',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Confirm Password">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            rules: [
              {
                required: true,
                message: 'Please agree to our term of service',
              },
            ],
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          )}
        </FormItem>
        <Row>
          <Col span={24}>
            {this.state.successRegisteringAccount && (
              <Alert message={this.state.serverSuccess} type="success" closable afterClose={this.closeAlert} showIcon />
            )}
            {this.state.errorRegisteringAccount && (
              <Alert message={this.state.serverErrors} type="error" closable afterClose={this.closeAlert} showIcon />
            )}
          </Col>
        </Row>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" loading={this.state.loading} htmlType="submit">
            Register
          </Button>
          <br />
          Or <a href="/signin">Sign In</a>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(RegistrationForm);
