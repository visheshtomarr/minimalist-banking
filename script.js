'use strict';

/////////////////////////////////////////////////
// MINIMALIST BANKING APP

// Data
const account1 = {
  owner: 'Richard Parker',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Peter Parker',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Harry Osborn',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Gwen Stacy',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  currency: 'USD',
  locale: 'en-US',
};

// Two new accounts with dates, currency and locale.
const account5 = {
  owner: 'Uncle Ben',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 5555,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2025-02-10T17:01:17.194Z',
    '2025-02-11T23:36:17.929Z',
    '2025-02-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};

const account6 = {
  owner: 'Aunt May',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 6666,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2025-01-25T18:49:59.371Z',
    '2025-01-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const accounts = [account1, account2, account3, account4, account5, account6];

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

// Format date and return the current movement date.
const formatMovementDate = (date, locale) => {
  // Function to calculate days passed according to the current date.
  const calcDaysPassed = (date1, date2) => 
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000))

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today'; 
  if (daysPassed === 1) return 'Yesterday'; 
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  
  return new Intl.DateTimeFormat(locale).format(date);
}

// Create the currency system based on the locale and currency
// provided as input.
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

// Function to create a logout timer.
const startLogoutTimer = () => {
  const logoutTimer = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When time becomes 0, we logout
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease time by one second
    time--;
  };
  
  // Set time to 5 minutes (300 seconds).
  let time = 300;

  // Call the timer in the beginning as well
  logoutTimer();

  // Then call the timer after every second.
  let timer = setInterval(logoutTimer, 1000);

  return timer;
}

// Function to display the movements.
const displayMovements = (account, sort = false) => {
  // Empty the current 'movements' container.
  containerMovements.innerHTML = '';

  // We will create a combined array of movements and movement dates (if available).
  const combinedMovementsDates = account.movements.map((mov, i) => {
    if (account.movementsDates) {
        return {
        movement: mov,
        movementDate: account.movementsDates.at(i),
      }
    }
    else {
      return { movement: mov };
    }
  });

  // Sort the movements based on the 'sort' argument's current state.
  // This will sort the movements in ascending order.
  if (sort) combinedMovementsDates.sort((a, b) => a.movement - b.movement);

  combinedMovementsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    // Type of movement
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const formattedMovement = formatCurrency(movement, account.locale, account.currency);

    if (account.movementsDates) {
      const date = new Date(movementDate);
      const displayDate = formatMovementDate(date, account.locale);
      
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>
      `;
      
        // We will be adding each new movement row element at the very beginning of
        // the 'movements' container. 
        containerMovements.insertAdjacentHTML('afterbegin', html);
    } else {
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>
      `;
      
        // We will be adding each new movement row element at the very beginning of
        // the 'movements' container. 
        containerMovements.insertAdjacentHTML('afterbegin', html);
    }
  })
}

// Calculate and display the balance of an account.
const calcAndDisplayBalance = account => {
  // Calculate the total balance of an account.
  account.balance = account.movements.reduce((acc, movement) => acc + movement, 0);
  
  // Display in UI.
  labelBalance.textContent = formatCurrency(account.balance, account.locale, account.currency);
}

// Calculate and display balance summary (in, out and interest).
const calcAndDisplayBalanceSummary = account => {
    // Calculate total deposits.
    const deposits = account.movements
      .filter(movement => movement > 0)
      .reduce((acc, deposit) => acc + deposit, 0);

    // Display in UI.
    labelSumIn.textContent = formatCurrency(deposits, account.locale, account.currency);

    // Calculate total withdrawals.
    const withdrawals = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);

    // Display in UI.
    labelSumOut.textContent = formatCurrency(Math.abs(withdrawals), account.locale, account.currency);

    // Calulate interest on deposits (only interests greater than 1 EUR).
    const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);

    // Display in UI.
    labelSumInterest.textContent = formatCurrency(interest, account.locale, account.currency);
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
  displayMovements(account);

  // Display account's balance
  calcAndDisplayBalance(account);

  // Display account summary
  calcAndDisplayBalanceSummary(account);
}

// Create a currently logged in account and global state of timer.
let currentAccount, timer;

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

    // Create current date and time.
    const now = new Date();
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    labelDate.textContent = new Intl
      .DateTimeFormat(currentAccount.locale, options)
      .format(now);

    // Clear input fields and make pin out of focus.
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // If timer state is true, we reset timer.
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

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
    // Performing transfer.
    receiverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Add new transfer date.
    currentAccount.movementsDates?.push(new Date().toISOString());
    receiverAccount.movementsDates?.push(new Date().toISOString());
    
    // Update UI
    updateUI(currentAccount);

    // Reset timer if user do a transfer.
    clearInterval(timer);
    timer = startLogoutTimer();
  }

  // Clear input fields and make pin out of focus.
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferTo.blur();
})

// Implement the loan functionality.
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // The loan will be granted only if any of the deposits is 
  // greater than or equal to 10% of the amount requested.
  if (
    amount > 0 && 
    currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    // Bank will take 3 seconds to process the loan amount.
    setTimeout(() => {
      // Add the loan amount to movements.
      currentAccount.movements.push(amount);

      // Add loan date.
      currentAccount.movementsDates?.push(new Date().toISOString());
      
      // Update UI.
      updateUI(currentAccount);

      // Reset timer if user takes a loan.
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
})

// Local state to check whether the movements are sorted or not.
let sorted = false;

// Implement the sort movements functionality.
btnSort.addEventListener('click', (e) => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})

// Implement the close account functionality.
btnClose.addEventListener('click', (e) => {
  // To prevent page reload after form submission.
  e.preventDefault();

  // Check if the logged in user is the one closing the account.
  if (currentAccount.username === inputCloseUsername.value && 
        currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(account => 
      account.username === currentAccount.username
    );
    // We will remove the user from the accounts array.
    accounts.splice(index, 1);
    // console.log(accounts);

    // Update UI
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    inputClosePin.blur();
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
})