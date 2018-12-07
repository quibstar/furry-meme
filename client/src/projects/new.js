import React, { Component } from 'react';
import Form from './form';
class ProjectNew extends Component {
  render() {
    return (
      <div>
        <h1>New Project</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default ProjectNew;
