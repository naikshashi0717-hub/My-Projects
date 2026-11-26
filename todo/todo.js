const addTask = document.getElementById("addlabel");
const displayItem = document.getElementById("displayContainer");
const addBtn = document.getElementById("addBtn");
const refreshBtn = document.getElementById("refreshBtn");
const calender = document.getElementById("date");
const addtime = document.getElementById("time");
const loginBtn = document.getElementById("loginBtn");
const Password = document.getElementById("password");
const UserEmail = document.getElementById("email");

const loginSection = document.getElementById("loginsection");
const todoSection = document.getElementById("todosection");

const logoutbtn = document.getElementById("logoutButton");

const RegisterEmail = document.getElementById("RegisterEmail");
const RegisterPassword = document.getElementById("RegisterPassword");
const RegisterBtn = document.getElementById("RegisterBtn");
const goToLogin = document.getElementById("goToLogin");
const RegisterSection = document.getElementById("registerSection");
const RegsiterPage = document.getElementById("RegsiterPage");

const loginfront = document.getElementById("loginfront");
const registerFront = document.getElementById("registerFront");
const frontSection = document.getElementById("frontSection");
const registerSection = document.getElementById("registerSection");


let isLoggedIn = false;
let todolistarray = [];
let RegisteredUserArray = [];

// To save the added todo
const storedUsers = localStorage.getItem("RegisteredUser");
if (storedUsers) {
    RegisteredUserArray = JSON.parse(storedUsers)
}

function savedlocker() {
    const currentuser = localStorage.getItem("loggedInUser");
    if(currentuser){
    localStorage.setItem(`MySavedTasks_${currentuser}`, JSON.stringify(todolistarray));
}

}

function buildtaskonscreen(tasketext, datetext, timetext, arrayindex, isCompleted) {
    const newtododrow = document.createElement('div');

    const compelteMessage = isCompleted ? `<p>Task completed</p>` : "";
    const textCapsule = document.createElement('div');
    textCapsule.innerHTML =
        `<p>${tasketext}</p>
    <p>${datetext}</p>
    <p>${timetext}</p>
    <p>${compelteMessage}</p>`;

    if (isCompleted) {
        textCapsule.style.color = "green"
    }

    const doneBtn = document.createElement('button');

    doneBtn.innerHTML = isCompleted ? "undo" : "done";
    doneBtn.style.backgroundColor = isCompleted ? "blue" : "cyan";
    doneBtn.addEventListener('click', () => {

        todolistarray[arrayindex].completed = !todolistarray[arrayindex].completed;
        rebuildAlltasks();
        savedlocker();
    });


    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "Delete";

    deleteBtn.addEventListener('click', () => {
        newtododrow.remove();
        todolistarray.splice(arrayindex, 1);
        savedlocker();
        rebuildAlltasks();
    });


    newtododrow.appendChild(textCapsule);
    newtododrow.appendChild(doneBtn);
    newtododrow.appendChild(deleteBtn);
    displayItem.appendChild(newtododrow);
}

function rebuildAlltasks() {
    displayItem.innerHTML = "";
    todolistarray.forEach((item, index) => {
        buildtaskonscreen(item.task, item.date, item.time, index, item.completed);
    });
}



// Register Section
RegisterBtn.addEventListener('click', (event) => {
    event.preventDefault();


    const registerEmail = RegisterEmail.value;
    const registerPassword = RegisterPassword.value;
    const RegEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if (!RegEmailPattern.test(registerEmail.trim())) {
        registerEmail.value = "";
        RegisterEmail.classList.add("error-msg");
        RegisterEmail.setAttribute("placeholder", "(e.g: abcd@gmail.com)");
        RegisterEmail.focus();
        return;
    }

    if (registerEmail.trim() === "" || registerPassword.trim() === "") {
        RegisterEmail.value = "";
        RegisterEmail.classList.add("error-msg");
        RegisterEmail.setAttribute("placeholder", "(e.g: abcd@gmail.com)");
        RegisterEmail.focus();

        RegisterPassword.value = "";
        RegisterPassword.classList.add("error-msg");
        RegisterPassword.setAttribute("placeholder", "Password mandatory");
        RegisterPassword.focus();
        return;

    };

    RegisterEmail.addEventListener('input', () => {
        RegisterEmail.classList.remove("error-msg")
    });

    RegisterPassword.addEventListener('input', () => {
        RegisterPassword.classList.remove("error-msg")
    });


    const userexist = RegisteredUserArray.find(user => user.email === registerEmail);
    if (userexist) {
        alert("Account already exist login again");
        return;
    }

    const newuserObject = {
        email: registerEmail,
        pass: registerPassword
    }
    RegisteredUserArray.push(newuserObject)
    localStorage.setItem("RegisteredUser", JSON.stringify(RegisteredUserArray));

    RegisterEmail.value = ""
    RegisterPassword.value = ""

    todoSection.style.display = "none";
    RegisterSection.style.display = "none";
    loginSection.style.display = "block";

    alert("registered successfully");



});

//login tag
loginfront.addEventListener('click', (event) => {
    event.preventDefault();

    frontSection.style.display = "none";
    registerSection.style.display = "none";
    todoSection.style.display = "none";
    loginSection.style.display = "block";
});

registerFront.addEventListener('click',(event)=>{
    event.preventDefault();

    frontSection.style.display = "none";
    registerSection.style.display = "block";
    todoSection.style.display = "none";
    loginSection.style.display = "none";
})

goToLogin.addEventListener('click', (event) => {
    event.preventDefault();
    todoSection.style.display = "none";
    loginSection.style.display = "block";
    RegisterSection.style.display = "none";

});



//go to registerpage
RegsiterPage.addEventListener('click', () => {
    todoSection.style.display = "none";
    loginSection.style.display = "none";
    RegisterSection.style.display = "block";
});



// Login button
loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const UserPassword = Password.value;
    const Uemail = UserEmail.value;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(Uemail.trim())) {
        UserEmail.value = "";
        UserEmail.classList.add("error-msg");
        UserEmail.setAttribute("placeholder", "(e.g: abcd@gmail.com)");
        UserEmail.focus();
        return;
    }

    if (Uemail.trim() === "" || UserPassword.trim() === "") {
        // alert("Enter the name and password to login");
        Password.value = "";
        Password.classList.add("error-msg");
        Password.setAttribute("placeholder", "User Password is Mandatory");
        Password.style.borderColor = "red";
        Password.focus();

        UserEmail.value = "";
        UserEmail.classList.add("error-msg");
        UserEmail.setAttribute("placeholder", "User Email is Mandatory");
        UserEmail.style.borderColor = "red";
        UserEmail.focus();
        return;
    }

    UserEmail.addEventListener('input', () => {
        UserEmail.classList.remove("error-msg")
    });

    Password.addEventListener('input', () => {
        Password.classList.remove("error-msg")
    });

    const emailExists = RegisteredUserArray.find(user => user.email === Uemail);

    if (!emailExists) {
        alert("Rgister the gmail!, It does not exist!");
        UserEmail.value = "";
        UserEmail.classList.add("error-msg");
        UserEmail.setAttribute("placeholder", "Email not registered");
        UserEmail.focus();
        return;
    }

    if (emailExists.pass !== UserPassword) {
        alert("incorrect password!");
        Password.value = "";
        Password.classList.add("error-msg");
        Password.setAttribute("placeholder", "Wrong Password");
        Password.focus();
        return;
    }

    localStorage.setItem("loggedInUser", Uemail.trim());

    frontSection.style.display = "none";
    loginSection.style.display = "none";
    RegisterSection.style.display = "none";
    todoSection.style.display = "block";


    isLoggedIn = true;

    const rawstoredtasktext = localStorage.getItem(`MySavedTasks_${Uemail.trim()}`);
    if (rawstoredtasktext) {
        todolistarray = JSON.parse(rawstoredtasktext);
        rebuildAlltasks();
    } else {
        todolistarray = [];
        rebuildAlltasks();
    }

    alert("Successfull login");
});

UserEmail.addEventListener('input', () => {
    UserEmail.classList.remove("error-msg");
});

Password.addEventListener('input', () => {
    Password.classList.remove("error-msg");
});



//  Add button
addBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (isLoggedIn === false) {
        alert("Access denied, Please login first");
        return;
    }


    const taskEnter = addTask.value;
    const dateEnter = calender.value;
    const timeEnter = addtime.value;

    if (taskEnter.trim() === "" || dateEnter === "" || timeEnter === "") {
        addTask.setAttribute("placeholder", "Enter valid thing");

        calender.setAttribute("placeholder", "Enter  date");

        addtime.setAttribute("placeholder", "Enter time");


    } else {

        const todoObject = {
            task: taskEnter,
            date: dateEnter,
            time: timeEnter
        };

        todolistarray.push(todoObject);

        savedlocker();

        rebuildAlltasks();


        addTask.value = "";
        calender.value = "";
        addtime.value = "";
    }
});



//Logout button
logoutbtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem("loggedInUser");

    isLoggedIn = false;

    UserEmail.value = "";
    Password.value = "";


    frontSection.style.display = "none";
    todoSection.style.display = "none";
    loginSection.style.display = "block";

    alert("user successfullly logged out")
});




//Saved user
const savedUser = localStorage.getItem("loggedInUser");
const rawstoredtasktext = localStorage.getItem(`MySavedTasks_${savedUser}`);

if (savedUser) {
    isLoggedIn = true;

    frontSection.style.display = "none"
    loginSection.style.display = "none";
    todoSection.style.display = "block";

    // alert(`Well Come back ${savedUser}`);

    if (rawstoredtasktext) {
        todolistarray = JSON.parse(rawstoredtasktext);
        rebuildAlltasks();
    }
}


