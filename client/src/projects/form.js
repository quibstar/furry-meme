import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import Network from '../services/network';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      project: this.props.project || null,
    };
  }

  componentDidMount = () => {
    // for editing
    if (this.props.project && this.props.project._id) {
      this.getProject(this.props.project._id);
    }
  };

  getProject = id => {
    Network.get('/projects/' + id, this.setProject);
  };

  setProject = res => {
    if (res && res.status === 200) {
      let p = res.data.project;
      this.setState({ project: p });
      this.props.form.setFieldsValue({
        name: p.name,
        description: p.description,
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        var project = {};
        project.name = values.name;
        project.description = values.description;
        if (this.state.project) {
          project._id = this.state.project._id;
          Network.put('/projects', project, this.networkResponse);
        } else {
          Network.post('/projects', project, this.networkResponse);
        }
      } else {
        // something didn't work
      }
    });
  };

  // Network Stuff
  networkResponse = res => {
    if (res && res.status) {
      if (res.status === 404) {
      } else if (res.status === 201 || res.status === 200) {
        if (this.props.callback) {
          this.props.callback();
        } else {
          // go to show.
          this.props.history.push('/projects/' + res.data.success._id);
        }
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col>
              <FormItem label={'Name'} required={true}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Name cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col>
              <FormItem label={'Description'}>{getFieldDecorator('description', {})(<TextArea />)}</FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" loading={this.state.loading} htmlType="submit">
              Save
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ProjectForm);
