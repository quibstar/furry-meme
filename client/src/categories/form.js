import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const CategoryForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, title } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} title={title} okText="Create" onCancel={onCancel} onOk={onCreate}>
          <Form layout="vertical">
            <FormItem label="Category">
              {getFieldDecorator('category', {
                rules: [{ required: true, message: 'Category cannot be blank' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default CategoryForm;
