import React, { Component } from 'react';
import { Table, Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Network from '../services/network';
import Form from './form';
import Drawer from '../drawer';

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      isLoading: false,
      showDrawer: false,
    };
  }

  componentDidMount() {
    this.fetchProjects();
    this.isLoading();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const path = this.props.match.path;
      if (path === '/projects/new') {
        this.setState({ showDrawer: true, id: 'new' });
      } else {
        // hide drawer
        this.setState({ showDrawer: false, id: null });
      }
    }
  }

  fetchProjects = () => {
    Network.get('/projects', this.setProjects);
  };

  setProjects = res => {
    if (res.status === 200) {
      const projects = res.data.projects;
      this.setState({ projects });
      this.doneLoading();
    } else {
      this.doneLoading();
    }
  };

  /**
   * is loading
   */
  isLoading = () => {
    this.setState({ isLoading: true });
  };
  doneLoading = () => {
    this.setState({ isLoading: false });
  };

  /**
   * show projects
   */
  showProjects = () => {
    if (this.state.projects.length && !this.state.isLoading) {
      return this.renderProjects(this.state.projects);
    } else if (this.state.projects.length === 0 && !this.state.isLoading) {
      return 'No Projects';
    } else {
      return <Skeleton active />;
    }
  };

  /**
   * Projects table
   */
  renderProjects = projects => {
    return (
      <Table
        rowKey={record => record._id}
        className={'project-table'}
        dataSource={projects}
        columns={this.buildColumns()}
      />
    );
  };

  dataSource = () => {};

  buildColumns() {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/projects/${record._id}`}>{text}</Link>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
    ];
  }

  // callbacks
  goToIndex = () => {
    this.props.history.push('/projects');
  };

  goToIndexAndReloadData = () => {
    this.fetchProjects();
    this.goToIndex();
  };

  render() {
    return (
      <div id="projects">
        <Link to={`/projects/new`}>
          <Button className="m-button" icon="plus" type="primary">
            New Project
          </Button>
        </Link>
        <Drawer showDrawer={this.state.showDrawer} callback={this.goToIndex}>
          <Form id={this.state.id} callback={this.goToIndexAndReloadData} />
        </Drawer>
        {/* <Link to="/projects/new" className="float-right right-link">
          <Icon type="plus" /> New Project
        </Link> */}
        <h1>Projects</h1>
        {this.showProjects()}
      </div>
    );
  }
}
export default Projects;
