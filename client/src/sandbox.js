import { Form, Input, Select, Button } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      amount: Form.createFormField({
        ...props.amount,
        value: props.amount.value,
      }),
      categories: Form.createFormField({
        ...props.categories,
        value: props.categories.value,
      }),
      category: Form.createFormField({
        ...props.category,
        value: props.category.value,
      }),
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})(props => {
  const { getFieldDecorator } = props.form;
  console.log(props);
  return (
    <Form onSubmit={() => props.handleSubmit()}>
      <FormItem label={'Budgeted Amount'} required={true}>
        {getFieldDecorator('amount', {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{ required: true, message: 'Budget Amount cannot be blank' }],
        })(<Input />)}
      </FormItem>
      <FormItem label={'Category'} required={true}>
        {getFieldDecorator('category', {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{ required: true, message: 'Category cannot be blank' }],
        })(
          <Select>
            {props.categories.map((c, idx) => {
              return (
                <Select.Option key={idx} value={c}>
                  {c}
                </Select.Option>
              );
            })}
          </Select>
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </FormItem>
    </Form>
  );
});

class Sandbox extends React.Component {
  state = {
    fields: {
      categories: ['test', '1', '2'],
      category: { value: '' },
      amount: {
        value: '',
      },
    },
  };

  componentDidMount() {
    console.log(this.props);
  }

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  handleSubmit(e) {
    e.preventDefault();
    console.log(e);
  }

  render() {
    const fields = this.state.fields;
    return (
      <div>
        <CustomizedForm {...fields} onChange={this.handleFormChange} handleSubmit={this.handleSubmit.bind(this)} />
        <pre className="language-bash">{JSON.stringify(fields, null, 2)}</pre>
      </div>
    );
  }
}

export default Sandbox;
