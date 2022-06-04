"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentUser;

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach((el, i) => {
    const type = el < 0 ? "withdrawal" : "deposit";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${el}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const updateUI = (currentUser) => {
  displayMovements(currentUser.movements);
  calcDisplayBalance(currentUser);
  calcDisplaySummary(currentUser);
};

const createUsername = function (accs) {
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((e) => e[0])
        .join(""))
  );
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((cur, mov) => cur + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements.filter((e) => e > 0).reduce((acc, e) => acc + e);
  const withdrawal = acc.movements
    .filter((e) => e < 0)
    .reduce((acc, e) => acc + e);
  const interest = acc.movements
    .filter((e) => e > 0)
    .map((e) => (e * acc.interestRate) / 100)
    .filter((e) => e >= 1)
    .reduce((acc, e) => acc + e);

  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${withdrawal}€`;
  labelSumInterest.textContent = `${interest}€`;
};

createUsername(accounts);

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentUser = accounts.find((e) => e.username === inputLoginUsername.value);

  if (Number(inputLoginPin.value) === currentUser.pin) {
    labelWelcome.textContent = `Welcome back! ${
      currentUser.owner.split(" ")[0]
    }`;

    updateUI(currentUser);

    containerApp.style.opacity = 100;
  }

  inputLoginPin.value = inputLoginUsername.value = "";
  inputLoginPin.blur();
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const targetUser = accounts.find((e) => e.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    targetUser &&
    targetUser.owner !== currentUser.owner &&
    amount <= currentUser.balance
  ) {
    targetUser.movements.push(amount);
    currentUser.movements.push(-amount);

    updateUI(currentUser);
  }
});