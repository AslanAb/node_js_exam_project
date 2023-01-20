if (JSON.parse(localStorage.getItem('user'))) {
    window.location.href = '../account/account.html'
}

document.querySelector('.submitRegistration').addEventListener('click', fnRegistraton)

const BASE_URL = "http://localhost:8090"

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

class NewUser {
    constructor(name, surname, email, password) {
        this.name = name
        this.surname = surname
        this.email = email
        this.password = password
    }
}

async function fnRegistraton() {
    let email = document.querySelector('#emailR').value
    let password = document.querySelector('#passwordR').value
    let name = document.querySelector('#nameR').value
    let surname = document.querySelector('#surnameR').value

    let newUser = new NewUser(name, surname, email, password)

    const users = await fetchData("/users")
    for (const user of users) {
        if (user.email == email) {
            return alert("Ошибка! Вы уже были зарегистрированы!")
        }
    }

    if (checkData(newUser)) {
        await fetch(BASE_URL + '/users', 
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser),
            })
        .then(() => {
            alert("Вы успешно зарегистрированы!")
            window.location.href = '../login/login.html'
        })
        .catch(() => alert("Ошибка отправки запроса на регистрацию!"));
    }
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const validatePassword = (password) => {
    return String(password)
        .match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g
        );
};

function checkData(newUser) {
    if (newUser.name.length < 1 || newUser.surname.length < 1) {
        alert('Заполните все поля!')
        return false;
    } else if (!validateEmail(newUser.email)) {
        alert('Некорректный email!')
        return false;
    } else if (!validatePassword(newUser.password)) {
        alert('Ошибка! Пароль должен быть не менее 8 символов, содержать не менее 1 заглавной, не менее 1 прописной буквы и не менее 1 цифры!')
        return false;
    } else {
        return true
    }
}

document.querySelector('.postsPage').addEventListener('click', () => {
    window.location.href = '../posts/posts.html'
})

document.querySelector('.usersPage').addEventListener('click', () => {
    window.location.href = '../users/users.html'
})

document.querySelector('.accountPage').addEventListener('click', () => {
    window.location.href = '../account/account.html'
})

document.querySelector('.buttonLogin').addEventListener('click', () => {
    window.location.href = '../login/login.html'
})