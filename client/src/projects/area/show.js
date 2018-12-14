import React, { Component } from 'react';
import { Icon, Card, Button, Popconfirm } from 'antd';
import Network from '../../services/network';
import Cost from '../cost';
import NewCost from '../cost/new';
const ButtonGroup = Button.Group;

class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area: this.props.area,
      total: 0,
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.area !== prevProps.area) {
      this.getArea(this.props.area._id);
    }
  };

  getArea = areaId => {
    let id = this.props.project._id + '==' + areaId;
    Network.get('/project-area', this.setArea, id);
  };

  setArea = res => {
    if (res && res.status === 200) {
      let a = res.data.area;
      this.setState({ area: a });
    }
  };

  /**
   * Areas
   */
  renderArea = () => {
    if (this.state.area) {
      let a = this.state.area;
      return (
        <div className="proj-card">
          <Card
            title={`Area: ${a.label}`}
            extra={
              <ButtonGroup className="float-right">
                <Button size="small" onClick={() => this.editArea(a._id)}>
                  <Icon type="form" />
                </Button>
                <Popconfirm
                  title="Are you sure delete this project?"
                  onConfirm={() => this.removeArea(a._id)}
                  onCancel={this.cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" type="danger">
                    <Icon type="delete" />
                  </Button>
                </Popconfirm>
              </ButtonGroup>
            }
          >
            <div className="dimensions">{this.dimensionsView(a)}</div>
            <div className="area-total">
              Total: {this.calculateArea(a)} {a.unit}
            </div>
            <div>{this.costAnalysis(a)}</div>
          </Card>
        </div>
      );
    }
  };

  costAnalysis = a => {
    let project = this.props.project;
    let area = this.props.area;

    return <Cost cost={a.cost} totalArea={this.calculateArea(a)} area={area} projectId={project._id} />;
  };

  dimensionsView = a => {
    let d = [];
    let count = a.widths.length;
    let i = 0;
    while (i < count) {
      d.push(
        <div key={i}>
          <span>
            {a.widths[i]} {a.unit}
          </span>
          <span> X </span>
          <span>
            {a.lengths[i]} {a.unit}
          </span>
        </div>
      );
      i++;
    }
    return d;
  };

  calculateArea = a => {
    let d = [];
    let count = a.widths.length;
    let i = 0;
    var total = 0;
    while (i < count) {
      total += a.widths[i] * a.lengths[i];
      i++;
    }
    return total;
  };

  /**
   * edit area
   */
  editArea = id => {
    this.props.editArea(id);
  };

  /**
   * Delete area
   */
  removeArea = id => {
    this.props.removeArea(id);
  };

  render() {
    return this.renderArea();
  }
}
export default Show;
