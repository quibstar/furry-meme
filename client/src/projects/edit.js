import React, { Component } from 'react';
import Form from './form';
class ProjectEdit extends Component {
  render() {
    return (
      <div>
        <h1>Edit Project</h1>
        <Form {...this.props} />
      </div>
    );
  }
}
export default ProjectEdit;
