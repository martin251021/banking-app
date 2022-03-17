'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "John Doe",
  movements: Array.from({length: 10}, (e, i) => Math.trunc(Math.random()*1000 + 1000)),
  interestRate: 1.5,
  pin: 5555,
}

const accounts = [account1, account2, account3, account4, account5];

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

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = ""; // maže povodný obsah daného elementu containerMovements => .movements, 
                                    // inner.HTML nastavuje text elementu na zvolený string
  
  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal"
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html); // vkladá texty, uložené v premennej "html" priamo do html kódu
  });
};



const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(e => e > 0).reduce((a,e) => a + e, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements.filter(e => e < 0).reduce((a,e) => a + e, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements.filter(e => e > 1).map(e => (e * acc.interestRate)/100).filter(e => e >= 1).reduce((a,e) => a + e);
  labelSumInterest.textContent = `${Math.trunc(interest)} €`
};


const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((a,e) => a + e, 0);
  labelBalance.textContent = `${acc.balance} €`
};

const createUsernames = function(accs) {
  accs.forEach(function(acc){
    acc.username = acc.owner
    .split(" ").map(e => e[0].toLowerCase()).join("");
  })
};

createUsernames(accounts);

const updateUI = function(acc) {
  displayMovements(acc.movements); // zobrazenie definovanych funkcii
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);  
}

let currentAccount;

btnLogin.addEventListener("click", function(e) {
  e.preventDefault();
  btnLogOut.classList.remove("hidden");
  currentAccount = accounts.find(e => e.username === inputLoginUsername.value);


  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Good Day, ${currentAccount.owner.split(" ")[0]}!`; // zobrazenie UI + správa
    containerApp.style.opacity = 100; 

    inputLoginUsername.value = inputLoginPin.value = ""; // zobrazenie "" teda prazdneho stringu do user/PIN
    inputLoginPin.blur(); // odstranenie focusu z poli user a PIN

    // update UI
    updateUI(currentAccount);

  };


});




btnTransfer.addEventListener("click", function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(e => e.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";

  if(amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username) {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      updateUI(currentAccount);
    };

  

});

btnLoan.addEventListener("click", function(e) {
  e.preventDefault();
  const amount = inputLoanAmount.value;

  if(amount > 0 && currentAccount.movements.some(e => e >= amount * 0.1)) {
    currentAccount.movements.push(Number(amount));
    updateUI(currentAccount);
  };

  inputLoanAmount.value = "";
}) 

btnClose.addEventListener("click", function(e) {
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin) {
      
      accounts.splice(accounts.findIndex(e => e.username === currentAccount.username), 1); // delete acc
      containerApp.style.opacity = 0; // hide UI
    };
    inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;

btnSort.addEventListener("click", function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// modal

const modal = document.querySelector(".modal");
const modal2 = document.querySelector(".modal2");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelector(".show-modal");
const btnCloseModal2 = document.querySelector(".close-modal2");
const btnLogOut = document.querySelector(".log-out");

const btnCreateAcc = document.querySelector(".open__account");
const inputCreateAccName = document.querySelector(".create__input--name");
const inputCreateAccSurname = document.querySelector(".create__input--surname");
const inputCreateAccPin = document.querySelector(".create__input--pin");

let accNum = 5;

const createAcc = function() {
  const name = inputCreateAccName.value;
  const surname = inputCreateAccSurname.value;
  const pin = Number(inputCreateAccPin.value);
  if (!name || !surname || !pin) {
    alert("Please fill in all the details!")
  } else {
    account5.owner = name.concat(" ", surname);
  account5.pin = pin;
  account5.username = account5.owner
    .split(" ").map(e => e[0].toLowerCase()).join("");
  inputCreateAccName.value = inputCreateAccSurname.value = inputCreateAccPin.value = "";
  openModal2();
  closeModal();
  // console.log(account5);
  }
  
};

const openModal = function() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const openModal2 = function() {
    modal2.classList.remove("hidden");
    overlay.classList.remove("hidden");
};


btnsOpenModal.addEventListener("click", function(e) {
  e.preventDefault();
  openModal();
});

const closeModal = function() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

const closeModal2 = function() {
  modal2.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnCloseModal.addEventListener("click", closeModal);
btnCloseModal2.addEventListener("click", closeModal2);
overlay.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal2);

document.addEventListener("keydown", function(e) {
    if(e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
        
    }
);

btnCreateAcc.addEventListener("click", function(e) {
  e.preventDefault();
  // openModal2();
  // modal2.classList.remove("hidden");
  // modal.classList.add("hidden");
  createAcc();
  
});

btnLogOut.addEventListener("click", function(e) {
  e.preventDefault();
  containerApp.style.opacity = 0;
  labelWelcome.textContent = ""; 
  btnLogOut.classList.add("hidden");
}, false)















