const usersContainer = document.querySelector(".mainMid");

const BASE_URL = "http://localhost:8090";

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

const drawUsers = async () => {
    usersContainer.innerHTML = "";
    const users = await fetchData("/users")
    const userId = JSON.parse(localStorage.getItem("user"))
    let userIndex
    users.forEach((user) => {
        if(user._id == userId) {
            userIndex = users.indexOf(user)
        }
    })
    users.splice(userIndex, 1)
    for (const user of users) {
        usersContainer.innerHTML += `
            <div class="autorsDiv">
                <div class="userDiv1 flex sb aiCenter">
                    <h1 class="autorName">${user.name} ${user.surname}</h1>
                    <button class="followAuthor buttonStyle" onclick="followAuthor('${user._id}')">Подписаться</button>
                    <button class="unfollowAuthor hide buttonStyle" onclick="unFollowAuthor('${user._id}')">Отписаться</button>
                </div>
            </div>
        `
        const isFollowed = await fetchData(`/users/followed/${user._id}/${userId}`)
        if (isFollowed == true) {
            document.querySelector(".followAuthor").classList.add("hide")
            document.querySelector(".unfollowAuthor").classList.remove("hide")
        } else {
            document.querySelector(".followAuthor").classList.remove("hide")
            document.querySelector(".unfollowAuthor").classList.add("hide")
        }
    }
}

function emptyUsersDiv () {
    if (usersContainer.innerHTML === "") {
        usersContainer.innerHTML = 
                `<div class="post">
                    <div>
                        <input type="checkbox" class="checker">
                        <div class="postTop">
                            <div class="flex sb aiCenter">
                                <h1 class="titleSearch">Кроме Вас никто не зарегистрирован</h1>
                            </div>
                        </div>
                    </div>
                </div>`
                
    }
}

if (JSON.parse(localStorage.getItem('user'))) {
    drawUsers()
    .then(() => emptyUsersDiv())
    document.querySelector('.postsPage').addEventListener('click', () => {
        window.location.href = '../posts/posts.html'
    })    
    document.querySelector('.usersPage').addEventListener('click', () => {
        drawUsers()
        .then(() => emptyUsersDiv())
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

async function followAuthor(userId) {
    const localUserId = JSON.parse(localStorage.getItem("user"))

    const payload = {
        "localUserId": localUserId
    }
    
    await fetch(BASE_URL + "/users/follow/" + `${userId}`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        drawUsers()
    })
    .catch((err) => alert("Ошибка при подписке!" + err))
}

async function unFollowAuthor(userId) {
    const localUserId = JSON.parse(localStorage.getItem("user"))

    const payload = {
        "localUserId": localUserId
    }
    
    await fetch(BASE_URL + "/users/unfollow/" + userId, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        drawUsers()
    })
    .catch((err) => alert("Ошибка при Отписке!"))
}

