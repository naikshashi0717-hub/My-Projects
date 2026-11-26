let expenses = [];

let description = document.getElementById("description");
console.log(description);
let amount = document.getElementById("amount");
console.log(amount);
let category = document.getElementById("category");
console.log(category);
let date = document.getElementById("date");
console.log(date);
let addButton = document.getElementById("add-btn");

let showExpense = document.getElementById("show-expense");


addButton.addEventListener("click", function () {
    let descriptionValue = description.value;
    let amountValue = amount.value;
    let categoryValue = category.value;
    let dateValue = date.value;

    let expense = {
        description: descriptionValue,
        amount: amountValue,
        category: categoryValue,
        date: dateValue
    }

    expenses.push(expense);
    console.log(expenses);

    displayExpesnse();

});

const displayExpesnse = () => {
    showExpense.innerHTML = "";

    expenses.forEach(function (expense, index) {
        showExpense.innerHTML +=
        `<div class="expense-list" >
        <p>${expense.description}</p>
        <p> ${expense.amount}</p>
        <p>${expense.category}</p>
        <p>${expense.date}</p>
            <button class="deletebutton" data-index="${index}">Delete</button>

        </div>`;
    });
    let deleteButton = document.querySelectorAll(".deletebutton");

    deleteButton.forEach(function (deleteButton) {
        deleteButton.addEventListener("click", function () {
            let index = deleteButton.dataset.index;

                expenses.splice(index,1)
            displayExpesnse();
        });
    });
};

