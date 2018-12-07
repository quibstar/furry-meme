import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox, Row, Col, Alert } from 'antd';
import Network from '../services/network';
import './auth.css';

const FormItem = Form.Item;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      successfulSignIn: false,
      errorSigningIn: false,
      serverErrors: '',
      serverSuccess: '',
      // toDashboard: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const user = { email: values.email, password: values.password };

        this.loadingTrue();
        Network.post('/signin', user, this.networkResponse);
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
      if (res.status === 401) {
        this.setState({ errorSigningIn: true, serverErrors: 'Please check your email and password' });
      } else if (res.status === 201 || res.status === 200) {
        // save to local storage
        localStorage.setItem('token', res.data.token);
        this.setState({
          successfulSignIn: true,
          errorSigningIn: false,
          serverSuccess: 'Successfully signed in',
          // toDashboard: true,
        });
        window.location.href = '/dashboard';
      }
    }
  };
  closeAlert = () => {
    this.setState({ successfulSignIn: false, errorSigningIn: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // if (this.state.toDashboard === true) {
    //   return <Redirect to="/dashboard" push={true} />;
    // }
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
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
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Row>
            <Col>
              {this.state.successfulSignIn && (
                <Alert
                  message={this.state.serverSuccess}
                  type="success"
                  closable
                  afterClose={this.closeAlert}
                  showIcon
                />
              )}
              {this.state.errorSigningIn && (
                <Alert message={this.state.serverErrors} type="error" closable afterClose={this.closeAlert} showIcon />
              )}
            </Col>
          </Row>
          <Button type="primary" loading={this.state.loading} htmlType="submit" className="login-form-button">
            Sign In
          </Button>
          Or <a href="/register">register now!</a>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SignIn);
