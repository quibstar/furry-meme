import React, { Component } from 'react';
import { Card, Button, Icon, Popconfirm } from 'antd';
import { toCurrency } from '../../utilities/to-currency';
import Network from '../../services/network';
import Drawer from '../../drawer';
import NewProduct from './new';
import EditProduct from './edit';

const ButtonGroup = Button.Group;

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
    };
  }

  /**
   * Products
   */
  renderProductDrawer = () => {
    return (
      <Drawer showDrawer={this.state.visibility} callback={this.animateProductForm}>
        {this.newOrEditProduct()}
      </Drawer>
    );
  };

  newOrEditProduct = () => {
    if (this.state.productId !== null) {
      return (
        <EditProduct
          project={this.props.project}
          productId={this.state.productId}
          product={this.state.product}
          callback={this.closeProductDrawerAndReloadProject}
          isEditing={true}
        />
      );
    } else {
      return (
        <NewProduct
          project={this.props.project}
          productId={null}
          product={null}
          callback={this.closeProductDrawerAndReloadProject}
          isEditing={false}
        />
      );
    }
  };

  /**
   * project action
   */
  animateProductForm = () => {
    var visibility = this.state.visibility;
    this.setState({ visibility: !visibility, productId: null, product: null });
  };

  /**
   * show products
   */
  showProjects = () => {
    if (this.props.products.length) {
      let products = this.props.products;
      return (
        <div>
          {this.renderProducts(products)}
          Products Total: {this.total(products)}
        </div>
      );
    }
    return <div>No products.</div>;
  };

  /**
   * Products Total
   */
  total = products => {
    let t = products.reduce((accumulator, p) => accumulator + p.total, 0);
    return toCurrency(t);
  };

  /**
   * Edit product
   */
  editProduct = product => {
    this.setState({ productId: product._id, product: product }, () => {
      this.setState({ visibility: true });
    });
  };

  /**
   * Remove product
   */
  removeProduct = productId => {
    // concat project id and area id
    var id = this.props.project._id + '==' + productId;
    Network.delete('/product-delete', this.deleteAreaResponse, id);
  };

  deleteAreaResponse = res => {
    if (res && res.status === 200) {
      this.props.fetchProject();
    }
  };

  /**
   *
   */
  closeProductDrawerAndReloadProject = () => {
    this.props.fetchProject();
    this.animateProductForm();
  };
  /**
   * render products
   */
  renderProducts = products => {
    return products.map(p => {
      return (
        <div key={p._id} style={{ clear: 'both' }}>
          {p.quantity}
          {p.unit} {p.name} @ {toCurrency(p.price)}. Total: {toCurrency(p.total)}
          <ButtonGroup>
            <Icon type="form" style={{ margin: '10px 0 0 10px' }} onClick={() => this.editProduct(p)} />

            <Popconfirm
              title="Are you sure delete this product?"
              onConfirm={() => this.removeProduct(p._id)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <Icon type="delete" style={{ margin: '10px 0 0 10px' }} />
            </Popconfirm>
          </ButtonGroup>
        </div>
      );
    });
  };

  render() {
    return (
      <div style={{ marginBottom: '20px' }}>
        {this.renderProductDrawer()}
        <Card
          title="Products"
          extra={
            <Button onClick={this.animateProductForm}>
              <Icon type="plus" />
              Add Product
            </Button>
          }
        >
          {this.showProjects()}
        </Card>
      </div>
    );
  }
}
export default Products;
