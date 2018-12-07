import React from 'react';
import PaymentModal from './payment-modal';
import Network from '../services/network';

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debt: this.props.debt || null,
      budget: this.props.budget || null,
      editing: false,
      payment: null,
      title: 'Payment',
    };
  }

  componentDidMount() {
    Network.get('/categories', this.setUpCategories);
  }

  setUpCategories = res => {
    if (res.status === 200) {
      const categories = res.data;
      const cb = categories.filter(c => c.name === 'payments');
      this.setState({ categories: cb[0].categories });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this.setState({ visible: this.props.visible, payment: this.props.payment });
    }

    if (prevProps.debt !== this.props.debt) {
      if (this.props.debt !== null) {
        this.setState({ title: `Payment for ${this.props.debt.name}`, debt: this.props.debt });
      } else {
        this.setState({ title: `Payment for ${this.props.budget.name}`, debt: null });
      }
    }
  }

  showModal = () => {
    // this.setState({ visible: true });
    this.props.showModal();
    this.formRef.props.form.resetFields();
  };

  handleCancel = () => {
    // this.setState({ visible: false });
    this.props.showModal();
    this.formRef.props.form.resetFields();
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        var payment = {};
        var debt = this.state.debt;
        var budget = this.state.budget;
        var payment = {};
        payment.amount = values.amount;
        payment.note = values.note;
        payment.category = values.category;
        payment.paidOn = values.paidOn ? values.paidOn.toDate() : '';
        payment.name = values.name;
        if (debt !== null) {
          payment.debtId = debt._id;
        }
        if (budget !== null) {
          payment.budgetId = budget._id;
        }

        if (values.id) {
          payment._id = values.id;
          Network.put('/payments', payment, this.networkResponse);
        } else {
          Network.post('/payments', payment, this.networkResponse);
        }
      } else {
        return;
      }
    });
  };

  // Network Stuff
  networkResponse = res => {
    if (res && res.status) {
      if (res.status === 404) {
      } else if (res.status === 201 || res.status === 200) {
        this.formRef.props.form.resetFields();
        this.props.callback();
        this.props.showModal();
      }
    }
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <PaymentModal
          wrappedComponentRef={this.saveFormRef}
          title={this.state.title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          payment={this.state.payment}
          categories={this.state.categories}
        />
      </div>
    );
  }
}

export default PaymentForm;
