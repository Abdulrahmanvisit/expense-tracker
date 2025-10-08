const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Event listener for form submission
transactionFormEl.addEventListener("submit", addTransaction);

// Function to add a new transaction
function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    // Validate inputs
    if (description === "" || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

    transactionFormEl.reset();
}

// Function to update the transaction list in the DOM
function updateTransactionList() {
    transactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        if (transaction.amount === 0) return; // Skip zero-amount transactions
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

// Helper function to create a new transaction list item
function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    const formattedAmount = formatCurrency(Math.abs(transaction.amount));

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>
            ${formattedAmount}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
    `;

    return li;
}

// Function to update the balance, income, and expense summary
function updateSummary() {
    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = Math.abs(
        transactions
            .filter((transaction) => transaction.amount < 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0)
    ); 

    balanceEl.textContent = formatCurrency(totalBalance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);
}

// Helper function to format a number as currency
function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(number);
}

// Function to remove a transaction by its ID
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}

// Initial render of transactions and summary on page load
updateTransactionList();
updateSummary();