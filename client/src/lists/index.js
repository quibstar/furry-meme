import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Icon, List, Card, Checkbox, Popconfirm } from 'antd';
import Form from './form';
import Drawer from '../drawer/';
import Network from '../services/network';
import './lists.css';

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      lists: [],
      editing: false,
    };
  }

  componentDidMount() {
    this.fetchLists();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const id = this.props.match.params.id;
      if (id !== undefined) {
        // show drawer
        if (id === 'new') {
          // new form
          this.setState({ showDrawer: true, id: 'new' });
        } else {
          // edit form
          this.setState({ showDrawer: true, id: id });
        }
      } else {
        // hide drawer
        this.setState({ showDrawer: false, id: null });
      }
    }
  }

  fetchLists = () => {
    Network.get('/lists', this.setLists);
  };

  setLists = res => {
    if (res.status === 200) {
      const lists = res.data.lists;
      this.setState({ lists });
    }
  };

  // drawer
  animateDrawer() {
    this.setState({ editing: false });
    this.props.history.push('/lists');
  }

  // delete
  confirm(id) {
    Network.delete('/lists', this.deleteResponse, id);
  }

  deleteResponse = () => {
    this.fetchLists();
  };

  cancel() {}

  // check boxes
  onChange = id => {
    let lists = this.state.lists;
    let updatedLists = lists.map(l => {
      l.listItems.map(i => {
        if (i._id === id) {
          i.done = !i.done;
        }
      });
      return l;
    });
    this.setState({ lists: updatedLists });
  };

  listItems(items) {
    if (items && items.length) {
      return items.map((i, idx) => {
        return (
          <div key={idx}>
            <Checkbox defaultChecked={i.done} onChange={() => this.onChange(i._id)} />
            <span className={i.done === true ? 'list-strike-through' : ''}>{i.name}</span>
          </div>
        );
      });
    }
  }

  render() {
    return (
      <div>
        <Link to={`/lists/new`}>
          <Button className="m-button" icon="plus" type="primary">
            New Lists Item
          </Button>
        </Link>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <Form id={this.state.id} fetchLists={this.fetchLists} />
        </Drawer>
        <h1>Lists</h1>
        {this.state.lists && (
          <List
            grid={{ gutter: 8, xs: 1, sm: 2, md: 3 }}
            dataSource={this.state.lists}
            renderItem={item => (
              <List.Item>
                <Card
                  title={item.name}
                  actions={[
                    <Link to={`/lists/edit/${item._id}`}>
                      <Icon type="form" />
                    </Link>,
                    <Popconfirm
                      title="Are you sure delete this?"
                      onConfirm={() => this.confirm(item._id)}
                      onCancel={this.cancel}
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                    >
                      <Icon type="delete" className="delete-red" />
                    </Popconfirm>,
                  ]}
                >
                  {this.listItems(item.listItems, false)}
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

export default Lists;
