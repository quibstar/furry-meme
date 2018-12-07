import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data, editingKey: '', budgetAmount: this.props.budgetAmount };
    this.columns = [
      {
        title: 'Item',
        dataIndex: 'item',
        editable: true,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a href="javascript:;" onClick={() => this.save(form, record._id)} style={{ marginRight: 8 }}>
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>

                  <a href="javascript:;" onClick={() => this.cancel(record._id)}>
                    Cancel
                  </a>
                </span>
              ) : (
                <a onClick={() => this.edit(record._id)}>Edit</a>
              )}
            </div>
          );
        },
      },
    ];
  }

  isEditing = record => {
    return record._id === this.state.editingKey;
  };

  edit(_id) {
    this.setState({ editingKey: _id });
  }

  save(form, _id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => _id === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(this.state.data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    var payments = this.state.data.reduce((sum, i) => (i.paid == true ? sum + i.amount : sum + 0), 0);
    console.log(this.state.budgetAmount);
    var total = this.state.budgetAmount - payments;
    var isGreen = total > -1 ? true : false;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'amount' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
        footer={() => (
          <span className={isGreen ? 'in-green' : 'in-red'}>
            {isGreen ? 'Left over' : 'Over spent: '}: {total}
          </span>
        )}
      />
    );
  }
}

export default EditableTable;
