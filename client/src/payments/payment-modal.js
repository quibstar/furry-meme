import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Row, Col } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

const PaymentModal = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        categories: this.props.categories || [],
        title: 'Payment',
      };
    }
    componentDidUpdate(prevProps) {
      if (prevProps.payment !== this.props.payment && this.props.payment !== null) {
        let payment = this.props.payment;
        this.props.form.setFieldsValue({
          amount: payment.amount,
          paidOn: payment.paidOn ? moment(payment.paidOn) : moment(),
          note: payment.note,
          id: payment._id,
          name: payment.name,
          category: payment.category,
        });
        // TODO: what is this below?
        // this.props.form.clear;
      }

      if (prevProps.categories !== this.props.categories) {
        this.setState({ categories: this.props.categories });
      }

      if (prevProps.title !== this.props.title) {
        this.setState({ title: this.props.title });
      }
    }

    render() {
      const { visible, onCancel, onCreate, title, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} title={this.state.title} okText="Submit Payment" onCancel={onCancel} onOk={onCreate}>
          <Form>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem label="Name">{getFieldDecorator('name', {})(<Input />)}</FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Amount">
                  {getFieldDecorator('amount', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: 'Amount cannot be blank' }],
                  })(<InputNumber />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem label="Paid On">{getFieldDecorator('paidOn', {})(<DatePicker />)}</FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Category">
                  {getFieldDecorator('category', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: 'Category cannot be blank' }],
                  })(
                    <Select>
                      {this.state.categories.map((c, idx) => {
                        return (
                          <Select.Option key={idx} value={c}>
                            {c}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem label="Note">{getFieldDecorator('note', {})(<Input />)}</FormItem>
            <FormItem>{getFieldDecorator('id', {})(<Input type="hidden" />)}</FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default PaymentModal;
