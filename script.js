"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2022-05-30T23:36:17.929Z",
    "2022-06-03T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "ar-QA", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

let currentUser, timerRuning;

const formatMovementsDate = (date, locale) => {
  const countPass = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const dayPass = countPass(date, new Date());

  if (dayPass === 0) return "Today";
  if (dayPass === 1) return "Yesterday";
  if (dayPass <= 7 && dayPass > 1) return `${dayPass} days a go`;

  return new Intl.DateTimeFormat(locale).format(date);

  // else {
  //   const d = `${date.getDate()}`.padStart(2, 0);
  //   const m = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const y = date.getFullYear();

  //   return `${d}/${m}/${y}`;
  // }
};

const timer = () => {
  let tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timers);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 120;
  tick();
  const timers = setInterval(tick, 1000);
  return timers;
};

const formatCurrency = (locale = "id-ID", currency = "USD", value) => {
  const option = { style: "currency", currency: currency };
  return new Intl.NumberFormat(locale, option).format(value);
};

const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = "";

  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((el, i) => {
    const type = el < 0 ? "withdrawal" : "deposit";
    const date = formatMovementsDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    const currecy = formatCurrency(acc.locale, acc.currency, el.toFixed(2));

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">${date}</div>
      <div class="movements__value">${currecy}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const updateUI = (currentUser) => {
  displayMovements(currentUser);
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
  labelBalance.textContent = formatCurrency(
    acc.locale,
    acc.currency,
    acc.balance.toFixed(2, 0)
  );
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

  labelSumIn.textContent = formatCurrency(
    acc.locale,
    acc.currency,
    income.toFixed(2, 0)
  );
  labelSumOut.textContent = formatCurrency(
    acc.locale,
    acc.currency,
    withdrawal.toFixed(2, 0)
  );
  labelSumInterest.textContent = formatCurrency(
    acc.locale,
    acc.currency,
    interest.toFixed(2, 0)
  );
};

createUsername(accounts);

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentUser = accounts.find((e) => e.username === inputLoginUsername.value);

  const date = new Date();

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const hour = date.getHours();
  // const minutes = `${date.getMinutes()}`.padStart(2, 0);

  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

  const option = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    weekday: "long",
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentUser.locale,
    option
  ).format(date);

  if (Number(inputLoginPin.value) === currentUser?.pin) {
    labelWelcome.textContent = `Welcome back! ${
      currentUser.owner.split(" ")[0]
    }`;

    timerRuning ? clearInterval(timerRuning) : (timerRuning = timer());
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
    targetUser.movementsDates.push(new Date().toISOString());
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date().toISOString());

    clearInterval(timerRuning);
    timerRuning = timer();
    updateUI(currentUser);
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const loan = Number(inputLoanAmount.value);

  if (loan > 0 && currentUser.movements.some((e) => e > (e * 0, 1))) {
    setTimeout(() => {
      currentUser.movements.push(loan);
      currentUser.movementsDates.push(new Date().toISOString());

      clearInterval(timerRuning);
      timerRuning = timer();
      updateUI(currentUser);
    }, 3000);
  }

  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const indexUser = accounts.findIndex(
      (e) => e.username === inputCloseUsername.value
    );

    accounts.splice(indexUser, 1);
  }

  containerApp.style.opacity = 0;
});

let sorted = false;

btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  displayMovements(currentUser.movements, !sorted);

  sorted = !sorted;
});