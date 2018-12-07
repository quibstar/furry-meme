export default {
  _id: '123456789',
  createdOn: '5/5/18',

  categories: [
    { budgets: ['Medical', 'Mortgage', 'Taxes'] },
    { debts: ['Credit Card', 'Car Loan', "Lowe's Card"] },
    { calendar: ['Work', 'Home', 'Other'] },
    { lists: ['Shopping', 'School'] },
    { tasks: ['Daily', 'Weekly', 'Monthly'] },
    { inventory: ['Home', 'Work', 'Hobby'] },
  ],

  roles: [
    {
      name: 'Admin',
      access: ['all'],
    },
    {
      name: 'Manager',
      access: ['budgets', 'debts', 'calendar', 'List', 'tasks', 'inventory', 'settings', 'users'],
    },
    {
      name: 'user',
      access: ['calendar', 'List', 'tasks'],
    },
  ],

  users: [
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      role: 'admin',
    },
    {
      firstName: 'Kris',
      lastName: 'Utter',
      email: 'quibstar@gmail.com',
      role: 'admin',
    },
  ],
  budgets: [
    {
      _id: '1',
      name: 'June Budget',
      category: 'monthly',
      budgetAmount: 2435.42,
      lineItems: [
        {
          _id: '11',
          name: 'Car Payment',
          amount: 135.42,
          paid: false,
          note: 'This is a note',
          accountNumber: '1234',
          paidOn: '7/9/18',
        },
        { _id: '22', name: 'Mortgage', amount: 1303.0, paid: true, note: '', accountNumber: '1234', paidOn: '7/9/18' },
      ],
    },
    {
      _id: '2',
      name: 'March Budget',
      category: 'monthly',
      budgetAmount: 2435.42,
      lineItems: [
        {
          _id: '33',
          name: 'Car Payment2',
          amount: 135.42,
          paid: false,
          note: 'Paid this off early to get some more money in savings',
          paidOn: '7/9/18',
          accountNumber: '1234',
        },
        {
          _id: '44',
          name: 'Mortgage2',
          amount: 1303.0,
          paid: false,
          note: 'This is note',
          paidOn: '7/9/18',
          accountNumber: '1234',
        },
      ],
    },
  ],
  goals: [
    {
      name: 'Save $500.00',
      action: [
        {
          name: 'deposit on 5/18/18',
          dueDate: 12458,
          notificationTime: 12345,
          completed: false,
          notifyMe: true,
        },
        {
          name: 'deposit on 6/18/18',
          completed: false,
          notifyMe: true,
        },
        {
          name: 'deposit on 7/18/18',
          completed: false,
        },
        {
          name: 'deposit on 8/18/18',
          completed: false,
        },
      ],
    },
  ],
  debts: [
    {
      _id: '1234',
      name: 'Chase',
      amount: 1000.42,
      accountNumber: '123',
      category: 'Credit Card',
      payments: [
        {
          amount: 100.5,
          paidOn: '1/5/12',
        },
        {
          amount: 23.34,
          paidOn: '2/5/12',
        },
        {
          amount: 100,
          paidOn: '3/5/12',
        },
      ],
    },
    {
      _id: '44542rtw',
      name: 'Car Loan',
      amount: 4567.34,
      accountNumber: '1233456789',
      category: 'Car Loan',
    },
  ],
};
