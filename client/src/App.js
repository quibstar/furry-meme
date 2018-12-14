import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import Media from 'react-media';
import './App.css';
import mainNav from './navigation';

import Dashboard from './dashboard/';
import Budgets from './budgets/index';
import BudgetsShow from './budgets/show';
import BudgetsNew from './budgets/new';
import BudgetsEdit from './budgets/edit';
import Debts from './debts/index';
import DebtsShow from './debts/show';
import Inventory from './inventory/';
import Calendar from './calendar/';
import Lists from './lists/';
import Tasks from './tasks/';
import Users from './users/';
import Account from './account';
import Categories from './categories';
import Goals from './goals';
import Sandbox from './sandbox';
import SignIn from '../src/auth/signin';
import Register from '../src/auth/register';
import UserHeader from './header/';
import Projects from './projects';
// import ProjectNew from './projects/new';
import ProjectEdit from './projects/edit';
import ProjectShow from './projects/show';
import Receipts from './receipts';
const Home = () => <h2>Home</h2>;
const NoMatch = ({ location }) => (
  <div>
    <h3>404</h3>
  </div>
);
const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      currentUlr: this.getUrl(),
      authenticated: false,
    };
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    if (token) {
      this.setState({ authenticated: true, currentUlr: this.getUrl() });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    var token = localStorage.getItem('token');
    // if we have a token and we're not authenticated
    if (token && !this.state.authenticated) {
      this.setState({ authenticated: true });
    }
  }

  getUrl = () => {
    var pathArray = window.location.pathname.split('/');
    return '/' + pathArray[1];
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  signOut = () => {
    this.setState({ authenticated: false });
    localStorage.clear();
  };

  /**
   * main nav
   */
  mainNav = () => {
    return mainNav.map((n, idx) => {
      return (
        <Menu.Item key={idx}>
          <Link key={idx} to={n.url}>
            <Icon type={n.icon} />
            {n.location}
          </Link>
        </Menu.Item>
      );
    });
  };

  renderAdmin() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Media query="(min-width: 599px)">
          {matches =>
            matches ? (
              <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                <Header />
                <Menu theme="dark" defaultSelectedKeys={[this.state.currentUlr]} mode="inline">
                  {this.mainNav()}
                </Menu>
              </Sider>
            ) : (
              ''
            )
          }
        </Media>
        <Layout>
          <UserHeader signOut={this.signOut} />
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route exact path="/dashboard" component={Dashboard} />

              <Route exact path="/budgets/new" component={BudgetsNew} />
              <Route exact path="/budgets/:id" component={BudgetsShow} />
              <Route exact path="/budgets/edit/:id" component={BudgetsEdit} />
              <Route exact path="/budgets" component={Budgets} />

              <Route exact path="/debts/:id" component={DebtsShow} />
              <Route exact path="/debts" component={Debts} />

              <Route exact path="/calendar" component={Calendar} />

              <Route exact path="/lists/edit/:id" component={Lists} />
              <Route exact path="/lists/:id" component={Lists} />
              <Route exact path="/lists" component={Lists} />

              <Route exact path="/inventory/edit/:id" component={Inventory} />
              <Route exact path="/inventory/:id" component={Inventory} />
              <Route exact path="/inventory" component={Inventory} />

              <Route exact path="/tasks/edit/id" component={Tasks} />
              <Route exact path="/tasks/:id" component={Tasks} />
              <Route exact path="/tasks" component={Tasks} />

              <Route exact path="/users/edit/:id" component={Users} />
              <Route exact path="/users/:id" component={Users} />
              <Route exact path="/users" component={Users} />

              <Route exact path="/account" component={Account} />

              <Route exact path="/categories" component={Categories} />

              <Route exact path="/goals" component={Goals} />

              <Route exact path="/projects/new" component={Projects} />
              <Route exact path="/projects/edit/:id" component={ProjectEdit} />
              <Route exact path="/projects/:id" component={ProjectShow} />
              <Route exact path="/projects" component={Projects} />

              <Route exact path="/receipts/edit/:id" component={Receipts} />
              <Route exact path="/receipts/:id" component={Receipts} />
              <Route exact path="/receipts" component={Receipts} />

              <Route exact path="/sandbox" component={Sandbox} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }} />
        </Layout>
      </Layout>
    );
  }

  renderPublicHeader() {
    return (
      <header id="public-header">
        <div id="logo">Logo here</div>
        <div id="to-admin">
          <Link to="signin">Sign In</Link>
          <Link to="register">Sign Up</Link>
        </div>
      </header>
    );
  }

  renderPublicFooter() {
    return <footer id="public-footer">links</footer>;
  }

  renderPublic() {
    return (
      <div>
        {this.renderPublicHeader()}
        <div id="public-main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/register" component={Register} />
            <Route component={NoMatch} />
          </Switch>
        </div>
        {this.renderPublicFooter()}
      </div>
    );
  }

  render() {
    if (this.state.authenticated) {
      return this.renderAdmin();
    }
    return this.renderPublic();
  }
}

export default App;
