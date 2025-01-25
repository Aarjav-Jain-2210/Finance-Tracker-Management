// Maintain your original user data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;
let currentBudget = 0;
let totalExpenses = 0;

const authSection = document.getElementById('auth-section');
const welcomeSection = document.getElementById('welcome-section');
const appSection = document.getElementById('app-section');
const budgetSection = document.getElementById('budget-section');
const expenseSection = document.getElementById('expense-section');
const adviceSection = document.getElementById('advice-section');
const expensesSection = document.getElementById('expenses-section');
const userNameDisplay = document.getElementById('user-name');
const budgetDisplay = document.getElementById('budget-display');
const remainingBudgetDisplay = document.getElementById('remaining-budget');
const expenseList = document.getElementById('expense-list');
const allExpensesList = document.getElementById('all-expenses-list');

// Initial state (assuming the form starts in "Sign Up" mode)
let isSignUpMode = true;

// Toggle between Sign-Up and Login
function toggleAuthMode() {
    const authTitle = document.getElementById('auth-title');
    const authButton = document.getElementById('auth-button');
    const toggleText = document.getElementById('toggle-auth');
    const toggleLink = document.getElementById('toggle-link');

    if (isSignUpMode) {
        authTitle.textContent = 'Login';
        authButton.textContent = 'Login';
        toggleText.firstChild.textContent = "Don't have an account? ";
        toggleLink.textContent = 'Sign Up';
        isSignUpMode = false;
    } else {
        authTitle.textContent = 'Sign Up';
        authButton.textContent = 'Sign Up';
        toggleText.firstChild.textContent = 'Already have an account? ';
        toggleLink.textContent = 'Login';
        isSignUpMode = true;
    }
}

// Attach the event listener only once
document.getElementById('toggle-link').addEventListener('click', toggleAuthMode);

// Handle Sign-Up and Login
function handleAuth() {
    const name = document.getElementById('name')?.value.trim(); // Sign-Up form: name field (optional)
    const contact = document.getElementById('contact')?.value.trim(); // Sign-Up form: contact field (optional)
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (isSignUpMode) { // Check if it's Sign-Up mode
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            alert('User already exists!');
            return;
        }
        users.push({ name, contact, username, password, expenses: [], budget: 0 });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign Up Successful! Please login.');
        return;
    } else { // It's Login mode
        const user = users.find(user => user.username === username && user.password === password);
        if (!user) {
            alert('Invalid credentials!');
            return;
        }
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Redirect to the desired link after successful login
        window.location.href = 'https://yashgupta2023.github.io/newfinancetracker/'; // Redirect to the external link
    }
}

// Attach the event listener for login
document.getElementById('auth-button').addEventListener('click', handleAuth);

// Set Budget Functionality
function setBudget(type) {
    const budgetInput = document.getElementById('budget-input').value;
    if (!budgetInput || isNaN(budgetInput)) {
        alert('Please enter a valid budget');
        return;
    }

    currentBudget = type === 'fresh' ? parseFloat(budgetInput) : currentBudget + parseFloat(budgetInput);
    budgetDisplay.textContent = `Current Budget: ₹${currentBudget}`;
    remainingBudgetDisplay.textContent = `Remaining Budget: ₹${currentBudget - totalExpenses}`;

    // Save the updated budget to the user's data
    currentUser.budget = currentBudget; 
    localStorage.setItem('users', JSON.stringify(users)); 
}

// Add Expense Functionality
function addExpense() {
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;

    if (!expenseAmount) {
        alert('Please enter a valid expense amount.');
        return;
    }

    const expense = { category: expenseCategory, amount: expenseAmount };
    currentUser.expenses.push(expense);
    totalExpenses += expenseAmount;
    localStorage.setItem('users', JSON.stringify(users));

    renderExpenses();
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = 'Food';
}

// Render All Expenses
function renderExpenses() {
    expenseList.innerHTML = '';
    allExpensesList.innerHTML = '';

    currentUser.expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('li');
        expenseItem.innerHTML = `${expense.category}: ₹${expense.amount}`;
        expenseList.appendChild(expenseItem);

        const allExpenseItem = document.createElement('li');
        allExpenseItem.textContent = `${expense.category}: ₹${expense.amount}`;
        allExpensesList.appendChild(allExpenseItem);
    });

    remainingBudgetDisplay.textContent = `Remaining Budget: ₹${currentBudget - totalExpenses}`;
}

// Show Financial Advice Based on Expenses
function viewAdvice() {
    resetSections();
    adviceSection.style.display = 'block';

    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = ''; // Clear existing advice

    if (totalExpenses > currentBudget) {
        const adviceItem = document.createElement('li');
        adviceItem.textContent = 'Warning! You have overspent your budget. Try to save more!';
        adviceList.appendChild(adviceItem);
    } else if (totalExpenses === 0) {
        const adviceItem = document.createElement('li');
        adviceItem.textContent = 'You haven\'t spent anything yet. Consider planning for your expenses.';
        adviceList.appendChild(adviceItem);
    } else {
        const adviceItem = document.createElement('li');
        adviceItem.textContent = 'Great job! You are staying within your budget. Keep it up!';
        adviceList.appendChild(adviceItem);
    }
}

// Show Specific Sections
function showBudgetSection() {
    resetSections();
    budgetSection.style.display = 'block';
}
function showExpenseSection() {
    resetSections();
    expenseSection.style.display = 'block';
}
function viewExpenses() {
    resetSections();
    expensesSection.style.display = 'block';
    renderExpenses();
}

// Reset All Sections
function resetSections() {
    budgetSection.style.display = 'none';
    expenseSection.style.display = 'none';
    adviceSection.style.display = 'none';
    expensesSection.style.display = 'none';
}

// Logout Functionality
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    authSection.style.display = 'block';
    welcomeSection.style.display = 'none';
    resetSections();
    currentBudget = 0; 
    totalExpenses = 0; 
}
