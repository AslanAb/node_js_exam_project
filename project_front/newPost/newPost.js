if (JSON.parse(localStorage.getItem('user'))) {
    document.querySelector('.postsPage').addEventListener('click', () => {
        window.location.href = '../posts/posts.html'
    })
    
    document.querySelector('.usersPage').addEventListener('click', () => {
        window.location.href = '../users/users.html'
    })
    
    document.querySelector('.accountPage').addEventListener('click', () => {
        window.location.href = '../account/account.html'
    })

    const buttonLogin = document.querySelector(".buttonLogin");
    buttonLogin.textContent = "Выйти"
    buttonLogin.addEventListener('click', () => {
        localStorage.removeItem("user")
        window.location.href = '../posts/posts.html'
    })
} else {
    window.location.href = '../posts/posts.html'
}

document.querySelector('.buttonPublic').addEventListener('click', fnPublicPost)

const BASE_URL = "http://localhost:8090"

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

async function fnPublicPost() {
    const title = document.querySelector('#titleR').value
    const text = document.querySelector('#textR').value
    const authorId = JSON.parse(localStorage.getItem("user"))

    const payload = {
        title: title,
        text: text,
        authorId: authorId
    }

    fetch(BASE_URL + '/posts',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
        .then(() => {
            alert("Ваш пост опубликован!")
            window.location.href = '../account/account.html'
        })
        .catch(() => alert("Ошибка отправки запроса на публикацию поста!"))
}


