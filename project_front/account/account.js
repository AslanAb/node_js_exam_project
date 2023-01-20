const userPostsContainer = document.querySelector(".mainMid");
const userData = document.querySelector(".mainLeft");


const BASE_URL = "http://localhost:8090";

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

const userId = JSON.parse(localStorage.getItem("user"))

const drawUser = async () => {
    userData.innerHTML = "";
    const user = await fetchData(`/users/${userId}`)
    userData.innerHTML += `
        <div class="portfileCard flex column aiCenter">
            <img src="http://localhost:8090/static/images/santa.png" alt="" class="santaImg">
            <p class="p1 idP uses_name">${user.name}</p>
            <span class="p1 nameSurnameP uses_surname">${user.surname}</span>
            <span class="p1 nameSurnameP uses_email">${user.email}</span>
            <button class="buttonLikePost flex aiCenter sb" onclick="changeUser('${user._id}', '${user.name}', '${user.surname}', '${user.email}')">Редактировать профиль</button>
            <button class="buttonNewPost buttonStyle flex sa aiCenter">Новая публикация</button>
        </div>
    `
    document.querySelector('.buttonNewPost').addEventListener('click', () => {
        window.location.href = '../newPost/newPost.html'
    })
}

const drawUserPosts = async () => {
    userPostsContainer.innerHTML = "";
    const posts = await fetchData("/posts")
    for (const post of posts) {
        const author = await fetchData("/users/" + post.author)
        if (post.author == userId) {
            userPostsContainer.innerHTML +=
                `<div class="post">
                <div>
                    <input type="checkbox" class="checker" id="${post._id}">
                    <div class="postTop">
                        <div class="flex sb aiCenter">
                            <h1 class="titleSearch">${post.title}</h1>
                            <span class="autorSpan">${author.name} ${author.surname}</h2>
                        </div>
                        <p class="p2 items-text textSearch">${post.text}</p>
                        <div class="bottom"></div>
                    </div>
                    <label class="label" for="${post._id}"></label>
                </div>
                <div class="flex sb aiCenter">
                    <div class="flex aiCenter sb">
                        Количество лайков
                        <span class="countOfLikes">${post.likes.length}</span>
                    </div>
                    <div class="flex aiCenter sb">
                        <button class="buttonLikePost flex aiCenter sb" onclick="changePost('${post._id}', '${post.title}', '${post.text}')">Редактировать пост</button>
                        <button class="buttonLikePost flex aiCenter sb" onclick="deletePost('${post._id}')">Удалить пост</button>
                    </div>
                </div>
            </div>`
        }
    }
}

function emptyPostDiv() {
    if (userPostsContainer.innerHTML === "") {
        userPostsContainer.innerHTML =
            `<div class="post">
                    <div>
                        <input type="checkbox" class="checker">
                        <div class="postTop">
                            <div class="flex sb aiCenter">
                                <h1 class="titleSearch">Опубликуйте Ваш первый пост</h1>
                            </div>
                            <p class="p2 items-text textSearch">Количетсвом текста Вы не ограничены =)</p>
                            <div class="bottom"></div>
                        </div>
                    </div>
                </div>`

    }
}

if (JSON.parse(localStorage.getItem('user'))) {
    drawUser()
    drawUserPosts()
        .then(() => emptyPostDiv())

    document.querySelector('.postsPage').addEventListener('click', () => {
        window.location.href = '../posts/posts.html'
    })
    document.querySelector('.usersPage').addEventListener('click', () => {
        window.location.href = '../users/users.html'
    })
    const buttonLogin = document.querySelector(".buttonLogin");
    buttonLogin.textContent = "Выйти"

    document.querySelector('.accountPage').addEventListener('click', () => {
        drawUserPosts()
            .then(() => emptyPostDiv())
    })

    buttonLogin.addEventListener('click', () => {
        localStorage.removeItem("user")
        window.location.href = '../posts/posts.html'
    })
} else {
    window.location.href = '../posts/posts.html'
}

const deletePost = (postId) => {
    fetch(BASE_URL + "/posts/" + postId,
        { method: "DELETE" })
        .then(() => {
            alert("Пост удален")
            drawUserPosts()
        })
        .catch((err) => alert(err))
}

const changePost = (postId, title, text) => {
    let hiddenDiv = document.querySelector(".hidden_div")
    hiddenDiv.style.display = "block";
    hiddenDiv.innerHTML = `
        <div class="flex aiCenter column">    
            <span>Название поста</span>
            <textarea class="new_title" type="text" cols="15" rows="5">${title}</textarea>
            <span>Текст поста</span>
            <textarea name="" class="newTextArea" cols="30" rows="10">${text}</textarea>
            <button class="newPostData" onclick="newPostData('${postId}')">Сохранить</button>
            <button onclick="back()" class="">Отмена</button>
        </div>
    `
}

async function newPostData(postId) {
    let hiddenDiv = document.querySelector(".hidden_div")
    const newTitle = document.querySelector(".new_title").value
    const newText = document.querySelector(".newTextArea").value
    const payload = {
        title: newTitle,
        text: newText
    }
    await fetch(BASE_URL + "/posts/change/" + postId, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(payload)
    })
        .then(() => {
            alert("Пост изменен")
            drawUserPosts()
            hiddenDiv.style.display = "none"
        })
        .catch((err) => alert(err))
}

const changeUser = (userId, name, surname, email) => {
    let hiddenDiv = document.querySelector(".hidden_div_user")
    hiddenDiv.style.display = "block";
    hiddenDiv.innerHTML = `
        <div class="flex aiCenter column">
            <span>Имя</span>
            <textarea class="new_name" type="text" cols="20" rows="5">${name}</textarea>
            <span>Фамилие</span>
            <textarea name="" class="new_surname" cols="30" rows="10">${surname}</textarea>
            <span>Email</span>
            <textarea name="" class="email" cols="30" rows="10">${email}</textarea>
            <button onclick="newUserData('${userId}')" class="newPostData">Сохранить</button>
            <button onclick="backUser()" class="">Отмена</button>
        </div>
    `
}

async function newUserData(id) {
    const newName = document.querySelector(".new_name").value
    const newSurname = document.querySelector(".new_surname").value
    const newEmail = document.querySelector(".email").value
    let hiddenDiv = document.querySelector(".hidden_div_user")
    const payload = {
        name: newName,
        surname: newSurname,
        email: newEmail
    }
    await fetch(BASE_URL + "/users/change/" + id, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(payload)
    })
        .then(() => {
            alert("Данные профиля изменены")
            drawUser()
            hiddenDiv.style.display = "none"
        })
        .catch((err) => alert(err))
}

function back() {
    let hiddenDiv = document.querySelector(".hidden_div")
    hiddenDiv.style.display = "none";
}
function backUser() {
    let hiddenDiv = document.querySelector(".hidden_div_user")
    hiddenDiv.style.display = "none";
}
