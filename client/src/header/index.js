import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon, Dropdown, Drawer } from 'antd';
import Network from '../services/network';
import Media from 'react-media';
import nav from '../navigation-mobile';
import './header.css';

const { Header } = Layout;
class UserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount = () => {
    this.checkForUser();
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.checkForUser();
    }
  }

  checkForUser = () => {
    Network.get('/current-user', this.setCurrentUser);
  };

  setCurrentUser = res => {
    if (res && res.status === 200) {
      const user = res.data.user;
      this.setState({ user });
    }
  };

  name = () => {
    if (this.state.user) {
      return `${this.state.user.firstName} ${this.state.user.lastName}`;
    }
  };

  profileLink = () => {
    if (this.state.user) {
      return (
        <Link to={`/profile/${this.state.user._id}`}>
          <Icon type="profile" /> Profile
        </Link>
      );
    }
  };

  // drawer
  animateDrawer() {
    var showDrawer = this.state.showDrawer;
    this.setState({ showDrawer: !showDrawer });
  }

  renderNav = () => {
    return nav.map((n, idx) => {
      return (
        <Menu.Item key={idx}>
          <Link key={idx} to={n.url} onClick={() => this.animateDrawer()}>
            {n.location}
          </Link>
        </Menu.Item>
      );
    });
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/" onClick={() => this.props.signOut()}>
            <Icon type="logout" /> Sign Out
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Header>
        <Drawer
          className="mobile-nav"
          placement="left"
          closable={false}
          onClose={() => this.animateDrawer()}
          visible={this.state.showDrawer}
        >
          <Menu mode="inline">{this.renderNav()}</Menu>
        </Drawer>
        <Media query="(min-width: 599px)">
          {matches =>
            matches ? (
              ''
            ) : (
              <a href="#!" onClick={() => this.animateDrawer()}>
                <Icon type="right" theme="outlined" />
              </a>
            )
          }
        </Media>
        <div style={{ float: 'right', marginRight: '20px' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              {this.name()} <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
    );
  }
}

export default UserHeader;
