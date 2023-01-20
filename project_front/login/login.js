if (JSON.parse(localStorage.getItem('user'))) {
    window.location.href = '../account/account.html'
}

document.querySelector('.loginButton').addEventListener('click', fnLoginBtn)

const BASE_URL = "http://localhost:8090"

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

async function fnLoginBtn() {
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value

    if (email.length < 1) {
        return alert ("Введите значения!")
    }
    const users = await fetchData("/users")
    for (const user of users) {
        if (user.email == email && user.password == password) {
            localStorage.setItem("user", JSON.stringify(user._id))
            window.location.href = '../account/account.html'
            return
        } else if (user.email == email && user.password != password) {
            return alert ("Неверный пароль!")
        }
    }
    return alert ("Пользователь с таким email незарегистрирован!")
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
document.querySelector('.registrationButton').addEventListener('click', () => {
    window.location.href = '../registration/registration.html'
})
document.querySelector('.buttonLogin').classList.add('hide')
