import React, { Component } from 'react';
import { Button, Popconfirm, Icon, Table } from 'antd';
import Form from './form';
import Drawer from '../drawer/';
import { Link } from 'react-router-dom';
import Network from '../services/network';
import InventoryTable from './table';
import InventoryList from './list';
import Media from 'react-media';

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      inventory: [],
      editing: false,
      id: null,
    };
  }

  componentDidMount() {
    this.fetchInventory();
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

  fetchInventory = () => {
    Network.get('/inventory', this.setInventory);
  };

  setInventory = res => {
    if (res && res.status === 200) {
      const inventory = res.data.inventory;
      this.setState({ inventory });
    }
  };

  // drawer
  animateDrawer() {
    this.setState({ editing: false });
    this.props.history.push('/inventory');
  }

  // delete
  confirm(id) {
    Network.delete('/inventory', this.deleteResponse, id);
  }

  deleteResponse = () => {
    this.fetchInventory();
  };

  cancel() {}

  render() {
    return (
      <div>
        <Link to={`/inventory/new`}>
          <Button className="m-button" icon="plus" type="primary">
            New Inventory Item
          </Button>
        </Link>
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer.bind(this)}>
          <Form id={this.state.id} fetchInventory={this.fetchInventory} />
        </Drawer>
        <h1>Inventory</h1>
        <Media query="(min-width: 767px)">
          {matches =>
            matches
              ? this.state.inventory && <InventoryTable inventory={this.state.inventory} />
              : this.state.inventory && <InventoryList inventory={this.state.inventory} />
          }
        </Media>
      </div>
    );
  }
}

export default Inventory;
