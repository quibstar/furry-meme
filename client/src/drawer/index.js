import React, { Component } from 'react';
import Button from 'antd/lib/button';

import './drawer.css';

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ showDrawer: this.props.showDrawer });
    }
  }

  render() {
    return (
      <div>
        <div
          onClick={() => this.props.callback()}
          className={`drawer-overlay ${this.state.showDrawer ? 'show' : ''}`}
        />
        <div className={`drawer ${this.state.showDrawer ? 'show' : ''}`}>
          <Button
            type="primary"
            style={{ float: 'right', marginTop: '10px' }}
            icon="right"
            onClick={() => this.props.callback()}
          />
          <div>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default Drawer;
