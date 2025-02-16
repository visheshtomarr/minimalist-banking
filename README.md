# Minimalist Banking Web App

A simple and elegant banking application built with HTML, CSS, and JavaScript. Special thanks to @[jonasschmedtmann](https://github.com/jonasschmedtmann) for teaching this project in his Udemy course. This project simulates basic banking functionalities including user login, balance tracking, money transfers, loan requests, and account closure—all wrapped in a minimalist design.

## Features

- **User Login**:  
  Log in with a username (automatically generated from your name) and PIN.

- **Dashboard**:  
  View your current balance, transaction history (movements), and a summary of deposits, withdrawals, and interest.

- **Transactions**:  
  - **Money Transfer**: Send money to other accounts.  
  - **Loan Request**: Request a loan (approved if any deposit is at least 10% of the requested amount).  
  - **Account Closure**: Close your account after confirming your username and PIN.  
  - **Sort Movements**: Toggle to sort your transaction history.

- **Auto Logout Timer**:  
  For security, the app logs out automatically after 5 minutes of inactivity.

- **Dynamic Date and Currency Formatting**:  
  Uses international standards to display dates and currencies in the appropriate format.

## Technologies Used

- **HTML5**: Structures the application.
- **CSS3**: Styles the app using modern design techniques and Google Fonts (Poppins).
- **JavaScript (ES6)**: Implements dynamic functionalities, including:
  - Login authentication.
  - Transaction handling (transfers, loans, account closure).
  - Auto logout timer with `setInterval`.
  - Date formatting with `Intl.DateTimeFormat` and currency formatting with `Intl.NumberFormat`.


## How to Use

1. **Clone or Download the Repository**:  
   Clone the repository via Git or download the ZIP file and extract it.

2. **Run the Application**:  
   Open the `index.html` file in any modern web browser (Chrome, Firefox, etc.) to launch the app.

3. **Login**:  
   Use one of the pre-defined accounts. For example, to log in as Richard Parker, you might use:
   - Username: `rp`
   - PIN: `1111`  
   *(Usernames are generated using the initials of the account owner's name.)*

4. **Interact with the App**:  
   After logging in, you can:
   - View your current balance and transaction history.
   - Transfer funds to other accounts.
   - Request a loan (if eligible).
   - Close your account.
   - Sort your transactions using the sort button.

## Customization

- **Adding New Accounts**:  
  You can add more accounts in the `script.js` file by following the existing account object structure.

- **Styling Adjustments**:  
  Modify the `style.css` file to tweak the look and feel of the user interface.

## Future Improvements

- **Enhanced Security**:  
  Implement more secure user authentication and data handling methods for a production environment.
- **Responsive Design**:  
  Further improve responsiveness for a better experience on various devices.
- **Additional Features**:  
  Consider adding account registration, data persistence, and backend integration.
