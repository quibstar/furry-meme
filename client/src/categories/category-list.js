import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Icon, notification, Popconfirm, Button, Divider } from 'antd';
import Network from '../services/network';
import Form from './form';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  // change background colour if dragging
  borderStyle: isDragging ? 'dashed' : 'solid',

  // styles we need to apply on draggables
  ...draggableStyle,
});

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories,
      id: this.props.id,
      categoryName: this.props.categoryName,
    };
  }
  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const categories = reorder(this.state.categories, result.source.index, result.destination.index);
    this.setState({ categories }, () => {
      this.updateCategories();
    });
  };

  updateCategories = () => {
    let id = this.state.id;
    let categories = this.state.categories;
    let category = { _id: id, categories };
    Network.put('/categories', category, this.responseFromUpdatingCategories, id);
  };

  responseFromUpdatingCategories = res => {
    if (res.status === 200) {
      this.notify('success');
    } else {
      this.notify('error');
    }
  };

  notify(type) {
    var text = type === 'success' ? 'Updated categories.' : 'Categories were not updated';
    var title = type === 'success' ? 'Success' : 'Error';
    notification[type]({
      message: title,
      description: text,
    });
  }

  removeCategory = idx => {
    var categories = this.state.categories;
    var categories = categories.filter(c => {
      return c !== categories[idx];
    });

    this.setState({ categories }, () => {
      this.updateCategories();
    });
  };

  /**
   * form
   */
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      let oldCats = this.state.categories;
      let categories = [...oldCats, values.category];
      this.setState({ categories }, () => {
        this.updateCategories();
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    return (
      <div>
        <div className="category-name">
          {this.props.categoryName}
          <Icon size="12" type="plus" onClick={this.showModal} style={{ float: 'right' }} />
        </div>
        <Divider />

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId={this.state.id}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {this.state.categories.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        className="item"
                      >
                        {item}
                        <div style={{ float: 'right' }}>
                          <Popconfirm
                            title="Are you sure delete this category?"
                            placement="topRight"
                            onConfirm={() => this.removeCategory(index)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Icon style={{ color: 'red' }} type="delete" />
                          </Popconfirm>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Form
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          title={`New category for ${this.state.categoryName}`}
        />
      </div>
    );
  }
}
export default CategoryList;
