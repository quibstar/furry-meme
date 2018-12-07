import React, { Component } from 'react';

export default function(ComposedComponent, authenticated) {
  class Authentication extends Component {
    constructor(props) {
      super(props);
      this.state = {
        authenticated: authenticated,
      };
    }

    componentDidMount() {
      if (!this.state.authenticated) {
        this.props.history.push('/');
      }
    }

    componentDidUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.history.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }
  return Authentication;
}
