'use strict';

/////////////////////////////////////////////////
// MINIMALIST BANKING APP

// Data
const account1 = {
  owner: 'Richard Parker',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Peter Parker',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Harry Osborn',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Gwen Stacy',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Currencies
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Function to display the movements.
const displayMovements = movements => {
  // Empty the current 'movements' container.
  containerMovements.innerHTML = '';

  movements.forEach(function (movement, i) {
    // Type of movement
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${movement}€</div>
      </div>
    `;

    // We will be adding each new movement row element at the very beginning of
    // the 'movements' container. 
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// Calculate and display the balance of an account.
const calcAndDisplayBalance = account => {
  // Calculate the total balance of an account.
  account.balance = account.movements.reduce((acc, movement) => acc + movement, 0);
  
  // Display in UI.
  labelBalance.textContent = `${account.balance}€`;
}

// Calculate and display balance summary (in, out and interest).
const calcAndDisplayBalanceSummary = account => {
    // Calculate total deposits.
    const deposits = account.movements
      .filter(movement => movement > 0)
      .reduce((acc, deposit) => acc + deposit, 0);

    // Display in UI.
    labelSumIn.textContent = `${deposits}€`;

    // Calculate total withdrawals.
    const withdrawals = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);

    // Display in UI.
    labelSumOut.textContent = `${Math.abs(withdrawals)}€`;

    // Calulate interest on deposits (only interests greater than 1 EUR).
    const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);

    // Display in UI.
    labelSumInterest.textContent = `${interest}€`;
}

// Create usernames for our accounts.
const creatUsernames = accounts => {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
}
creatUsernames(accounts);

// Function to update UI.
const updateUI = account => {
  // Display movements
  displayMovements(account.movements);

  // Display account's balance
  calcAndDisplayBalance(account);

  // Display account summary
  calcAndDisplayBalanceSummary(account);
}

// Create a currently logged in account.
let currentAccount;

// Implement the login functionality.
btnLogin.addEventListener('click', (e) => {
  // Prevent form from submitting
  e.preventDefault();

  // Finding the current account in the 'accounts' array.
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);

  // Check whether the pin is correct or not.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    // Clear input fields and make pin out of focus.
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
  
  else if (currentAccount?.pin !== Number(inputLoginPin.value)) {
    // Display Error message in UI and hide app container.
    labelWelcome.textContent = 'Wrong Pin! Please try again!';
    containerApp.style.opacity = 0;

    // Clear input fields and make pin out of focus.
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
})

// Implement the transfer money functionality.
btnTransfer.addEventListener('click', (e) => {
  // To prevent page reload after form submission.
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  
  // Check whether the receiver is a valid one, if the sender has enough balance 
  // to transfer and also a user cannot transfer to themselves.
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    receiverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    updateUI(currentAccount);
  }

  // Clear input fields and make pin out of focus.
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferTo.blur();
})