import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Icon, Select } from 'antd';
import Network from '../../services/network';
import './area.css';
const FormItem = Form.Item;
const Option = Select.Option;
let id = 0;

class AreaForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      project: this.props.project,
      areaId: this.props.areaId || null,
      area: null,
    };
  }

  componentDidMount = () => {
    // for editing
    if (this.props.areaId) {
      this.getArea(this.props.project._id);
    }
  };

  getArea = id => {
    var id = this.props.project._id + '==' + this.props.areaId;
    Network.get('/project-area/' + id, this.setArea);
  };

  setArea = res => {
    if (res && res.status === 200) {
      let a = res.data.area;
      this.setState({ area: a });
      this.props.form.setFieldsValue({
        label: a.label,
        unit: a.unit,
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        let area = {};
        area.label = values.label;
        area.widths = values.width;
        area.lengths = values.length;
        area.heights = values.height;
        area.unit = values.unit;
        // filter
        area.widths = area.widths.filter(x => x != null);
        area.lengths = area.lengths.filter(x => x != null);
        area.heights = area.heights.filter(x => x != null);
        area.projectId = this.state.project._id;
        if (this.state.areaId) {
          area._id = this.state.areaId;
          Network.put('/project-area', area, this.networkResponse);
        } else {
          Network.post('/project-area', area, this.networkResponse);
        }
      } else {
        // TODO: FIX THIS
      }
    });
  };

  // Network Stuff
  networkResponse = res => {
    if (res && res.status) {
      if (res.status === 404) {
      } else if (res.status === 201 || res.status === 200) {
        this.props.callback();
      }
    }
  };

  /**
   * Add Dimension
   */
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    var area = this.state.area;
    getFieldDecorator('keys', {
      initialValue: area
        ? area.widths.map((a, idx) => {
            return idx;
          })
        : [],
    });
    const keys = getFieldValue('keys');
    const dimensions = keys.map((k, index) => (
      <div key={index}>
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <FormItem label={index === 0 ? 'Width' : ''} required={true}>
              {getFieldDecorator(`width[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    message: 'Width required',
                  },
                ],
                initialValue: area ? area.widths[index] : null,
              })(<InputNumber placeholder="Width" />)}
            </FormItem>
          </Col>
          <Col xs={12} sm={6}>
            <FormItem label={index === 0 ? 'Length' : ''} required={true}>
              {getFieldDecorator(`length[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    message: 'Height required',
                  },
                ],
                initialValue: area ? area.lengths[index] : null,
              })(<InputNumber placeholder="Length" />)}
            </FormItem>
          </Col>
          <Col xs={12} sm={6}>
            <FormItem label={index === 0 ? 'Height' : ''} required={false}>
              {getFieldDecorator(`height[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: area ? area.heights[index] : null,
              })(<InputNumber placeholder="Height" />)}
            </FormItem>
          </Col>
          <Col xs={12} sm={6}>
            <FormItem>
              {keys.length > 1 ? (
                <Button
                  type="danger"
                  className={index === 0 ? 'dynamic-delete-button' : ''}
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                >
                  <Icon type="delete" />
                  Remove
                </Button>
              ) : null}
            </FormItem>
          </Col>
        </Row>
      </div>
    ));

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label={'Label'} required={true}>
                {getFieldDecorator('label', {
                  rules: [{ required: true, message: 'label cannot be blank' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={'Unit of measure'} required={true}>
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: 'Unit(s) cannot be blank' }],
                })(
                  <Select>
                    {['ea.', 'bx.', 'pc.', 'case', 'pallet', 'lb.', 'ft.', 'yds.', 'pt.', 'qt.', 'l.', 'gal.'].map(
                      (c, idx) => {
                        return (
                          <Option key={idx} value={c}>
                            {c}
                          </Option>
                        );
                      }
                    )}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>{dimensions}</Row>
          <FormItem>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Add Dimensions
            </Button>
          </FormItem>
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
export default Form.create()(AreaForm);
