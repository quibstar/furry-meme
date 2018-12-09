import React, { Component } from 'react';
import NewCost from './new';
import EditCost from './edit';
import { toCurrency } from '../../utilities/to-currency';
import { Icon, Popconfirm, Divider, Button } from 'antd';
import Drawer from '../../drawer';
import Network from '../../services/network';
class Cost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      costs: this.props.cost || [],
      totalArea: this.props.totalArea,
      showDrawer: false,
    };
  }

  fetchCost = () => {
    let id = this.props.projectId + '==' + this.props.area._id;
    Network.get('/area-costs', this.setCost, id);
  };

  setCost = res => {
    if (res && res.status === 200) {
      let costs = res.data.costs;
      this.setState({ costs });
    }
  };

  /**
   * Remove area
   */
  removeCost = id => {
    // concat project id and area id
    let ids = this.props.projectId + '==' + this.props.area._id + '==' + id;
    Network.delete('/cost-delete', this.deleteAreaResponse, ids);
  };

  deleteAreaResponse = res => {
    if (res && res.status === 200) {
      this.fetchCost();
    }
  };

  renderCosts = () => {
    if (this.state.costs.length) {
      return this.state.costs.map((c, idx) => {
        return (
          <div key={idx}>
            {c.material} at ${c.pricePerUnit} per square {this.props.area.unit} will cost{' '}
            {toCurrency(c.pricePerUnit * this.state.totalArea)}
            <Icon type="form" style={{ margin: '10px 0 0 10px' }} onClick={() => this.editCost(c._id)} />
            <Popconfirm
              title="Are you sure delete this project?"
              onConfirm={() => this.removeCost(c._id)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <Icon type="delete" style={{ margin: '10px 0 0 10px' }} />
            </Popconfirm>
          </div>
        );
      });
    } else {
      return <div>Start your cost analysis.</div>;
    }
  };

  editCost = id => {
    this.setState({ costId: id }, () => {
      this.animateForm();
    });
  };

  /**
   * Animate form
   */
  animateForm = () => {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  };

  animateNewForm = () => {
    this.setState({ costId: null }, () => {
      this.animateForm();
    });
  };

  costDrawer = () => {
    return (
      <Drawer showDrawer={this.state.showDrawer} callback={this.animateForm}>
        {this.newOrEditArea()}
      </Drawer>
    );
  };

  newOrEditArea = () => {
    let areaId = this.props.area._id;
    let projectId = this.props.projectId;
    if (this.state.costId !== null) {
      return (
        <EditCost
          areaId={areaId}
          projectId={projectId}
          costId={this.state.costId}
          callback={this.closeDrawerAndReload}
          showDrawer={this.state.showDrawer} //
        />
      );
    } else {
      return (
        <NewCost
          areaId={areaId}
          projectId={projectId}
          costId={null}
          callback={this.closeDrawerAndReload}
          showDrawer={this.state.showDrawer} // resets form
        />
      );
    }
  };

  /**
   * Edit callback
   */
  closeDrawerAndReload = () => {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer, costId: null });
    this.fetchCost();
  };

  render() {
    return (
      <div>
        {this.costDrawer()}
        <Divider />
        <Button className="float-right" onClick={this.animateNewForm}>
          <Icon type="plus" />
          Cost Analysis
        </Button>
        <h3>Cost Analysis</h3>
        {this.renderCosts()}
        {/* <NewCost areaId={areaId} projectId={projectId} /> */}
      </div>
    );
  }
}
export default Cost;
