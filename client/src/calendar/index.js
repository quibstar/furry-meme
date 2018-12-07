import React, { Component } from 'react';
import Button from 'antd/lib/button';

class Calendars extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button style={{ float: 'right', marginTop: '10px' }} icon="plus">
          New Calendar Item
        </Button>
        <h1>Calendar</h1>
      </div>
    );
  }
}

export default Calendars;
