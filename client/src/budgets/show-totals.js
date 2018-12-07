import React from 'react';
import { toCurrency } from '../utilities/to-currency';

export function showTotals(fields) {
  if (fields.amount !== undefined && fields.amounts && fields.amounts.length) {
    let amounts = fields.amounts;
    let paidAmount = [];
    fields.paid.forEach((e, idx) => {
      if (e === true) {
        paidAmount.push(amounts[idx]);
      }
    });

    let totalPayments = amounts.length ? amounts.reduce((sum, a) => sum + parseFloat(a), 0) : 0;
    let amount = fields.amount;
    var paidValue = paidAmount.reduce((sum, a) => sum + parseFloat(a), 0);
    let total = fields.amount - paidValue;

    return (
      <div className="totals-wrap">
        <div>
          Payments: <span className="totals">{toCurrency(totalPayments)}</span>
        </div>
        <div>
          Payments Paid: <span className="totals">{toCurrency(paidValue)}</span>
        </div>
        <div>
          Budgeted Amount: <span className="totals">{toCurrency(amount)}</span>
        </div>
        <div className={total > -1 ? 'in-green' : 'in-red'}>
          {fieldsStatus(total)}: <span className="totals">{toCurrency(total)}</span>
        </div>
      </div>
    );
  }
}

function filterAndReduce(amounts) {
  return amounts.filter(a => (a === undefined ? 0 : parseFloat(a))).reduce((sum, a) => sum + parseFloat(a), 0);
}

function fieldsStatus(total) {
  if (total > 0) {
    return 'Under Budget';
  } else if (total < 0) {
    return 'Over Budget';
  } else if (total === 0) {
    return 'On Budget';
  }
}
