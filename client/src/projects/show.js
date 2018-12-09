import React, { Component } from 'react';
import Network from '../services/network';
import { Divider, Popconfirm, Button, Icon, Row, Col } from 'antd';
import Drawer from '../drawer';
import EditProject from './edit';
import NewArea from './area/new';
import EditArea from './area/edit';
import ShowArea from './area/show';
import Products from './products';

class ProjectShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      showDrawer: false,
      showAreaDrawer: false,
      areaId: null,
      productDrawerVisibility: false,
      showProductDrawer: false,
      productId: null,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      var id = this.props.match.params.id;
      if (id) {
        this.setState({ id: id }, () => {
          this.fetchProject();
        });
      }
    }
  }

  fetchProject = () => {
    var id = this.state.id;
    Network.get('/projects', this.setProject, id);
  };

  setProject = res => {
    if (res && res.status === 200) {
      const project = res.data.project;
      this.setState({ project: project });
    }
  };

  /**
   * Delete Project
   */
  confirm = () => {
    var id = this.state.project._id;
    Network.delete('/projects', this.deleteResponse, id);
  };

  deleteResponse = () => {
    this.props.history.push('/projects');
  };

  cancel = () => {};

  // drawer
  animateDrawer = () => {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  };

  /**
   * Areas
   */
  animateAreaForm = () => {
    var showAreaDrawer = this.state.showAreaDrawer;
    this.setState({ showAreaDrawer: !showAreaDrawer, areaId: null });
  };

  /**
   * Project Header
   */
  projectHead() {
    if (this.state.project) {
      var project = this.state.project;
      return (
        <div>
          <h1 className="float-left">{project.name}</h1>
          <Button size="small" type="" style={{ margin: '10px 0 0 10px' }} onClick={() => this.animateDrawer()}>
            <Icon type="form" />
          </Button>
          <Popconfirm
            title="Are you sure delete this project?"
            onConfirm={this.confirm}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="danger" style={{ margin: '10px 0 0 10px' }}>
              <Icon type="delete" />
            </Button>
          </Popconfirm>
        </div>
      );
    } else {
      return <h1>Budget Not found :(</h1>;
    }
  }

  /**
   * Edit callback
   */
  closeDrawerAndReloadProject = () => {
    this.setState({ showDrawer: false, productDrawerVisibility: false, areaId: null, productId: null });
    this.fetchProject();
  };

  /**
   * Area Callback
   */
  closeAreaDrawerAndReloadProject = () => {
    this.setState({ showAreaDrawer: false, areaId: null });
    this.fetchProject();
  };

  editDrawer = () => {
    if (this.state.project) {
      return (
        <Drawer showDrawer={this.state.showDrawer} callback={this.animateDrawer}>
          <EditProject project={this.state.project} callback={this.closeDrawerAndReloadProject} />
        </Drawer>
      );
    }
  };

  areaDrawer = () => {
    if (this.state.project) {
      return (
        <Drawer showDrawer={this.state.showAreaDrawer} callback={this.animateAreaForm}>
          {this.newOrEditArea()}
        </Drawer>
      );
    }
  };

  newOrEditArea = () => {
    if (this.state.areaId !== null) {
      return (
        <EditArea
          project={this.state.project}
          areaId={this.state.areaId}
          callback={this.closeAreaDrawerAndReloadProject}
        />
      );
    } else {
      return <NewArea project={this.state.project} callback={this.closeAreaDrawerAndReloadProject} />;
    }
  };

  /**
   * Areas
   */
  areas = () => {
    if (this.state.project) {
      let areas = this.state.project.areas;
      let project = this.state.project;
      return areas.map((a, idx) => {
        return <ShowArea project={project} area={a} key={idx} removeArea={this.removeArea} editArea={this.editArea} />;
      });
    }
  };

  /**
   * Remove area
   */
  removeArea = areaId => {
    // concat project id and area id
    var id = this.state.project._id + '==' + areaId;
    Network.delete('/area-delete', this.deleteAreaResponse, id);
  };

  deleteAreaResponse = res => {
    if (res && res.status === 200) {
      this.fetchProject();
    }
  };

  /**
   * Edit Area
   */
  editArea = id => {
    this.setState({ areaId: id }, () => {
      this.setState({ showAreaDrawer: true });
    });
  };

  render() {
    return (
      <div>
        {this.areaDrawer()}
        <div>
          <Button className="link" onClick={this.animateAreaForm}>
            <Icon type="plus" />
            Add Area
          </Button>
          {this.projectHead()}
          <Divider />
          {this.state.project ? (
            <Products
              products={this.state.project.products}
              project={this.state.project}
              fetchProject={this.fetchProject}
              closeAreaDrawerAndReloadProject={this.closeAreaDrawerAndReloadProject}
            />
          ) : (
            ''
          )}
          {this.editDrawer()}
          {this.areas()}
        </div>
      </div>
    );
  }
}
export default ProjectShow;
