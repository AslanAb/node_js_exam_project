const postsContainer = document.querySelector(".mainMid")

const BASE_URL = "http://localhost:8090";

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

const drawPosts = async () => {
    let ourUser = JSON.parse(localStorage.getItem('user'))
    postsContainer.innerHTML = "";
    const posts = await fetchData("/posts")
    const users = await fetchData("/users")
    let usersArr = []
    for (const user of users) {
        if (user.followers.includes(ourUser)) {
            usersArr.push(user._id)
        }
    }

    for (const post of posts) {
        const author = await fetchData("/users/" + post.author)
        if (usersArr.includes(post.author)) {
            postsContainer.innerHTML += `
                <div class="post">
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
                        <button class="buttonLikePost flex aiCenter sa" onclick="buttonLikePost('${post._id}')">
                            <img src="http://localhost:8090/static/images/like.png" alt="">
                            Нравится
                            <span class="countOfLikes">${post.likes.length}</span>
                        </button>
                    </div>
                </div>
            `
        }
    }
}

if (JSON.parse(localStorage.getItem('user'))) {
    drawPosts()
        .then(() => emptyPostDiv())

    document.querySelector('.postsPage').addEventListener('click', () => {
        drawPosts()
            .then(() => emptyPostDiv())
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
    postsContainer.innerHTML = `
        <div class="post">
            <h1 class="titleSearch"> Для просмотра опубликованных постов Вам необходимо войти в аккаунт</h1>
        </div>
        `

    document.querySelector('.usersPage').addEventListener('click', () => {
        alert("Необходимо войти в аккаунт для просмотра всех пользователей")
    })

    document.querySelector('.accountPage').addEventListener('click', () => {
        alert("Необходимо войти в аккаунт для просмотра своих данных и публикации постов")
    })

    document.querySelector('.buttonLogin').addEventListener('click', () => {
        window.location.href = '../login/login.html'
    })
}

function emptyPostDiv() {
    if (postsContainer.innerHTML == "") {
        postsContainer.innerHTML = `
            <div class="post">
                <div>
                    <input type="checkbox" class="checker">
                    <div class="postTop">
                        <div class="flex sb aiCenter">
                            <h1 class="titleSearch">Еще никто не публиковал пост</h1>
                        </div>
                        <p class="p2 items-text textSearch">Будьте первым =)</p>
                        <div class="bottom"></div>
                    </div>
                </div>
            </div>
            `
    }
}

async function buttonLikePost(postId) {
    let userId = JSON.parse(localStorage.getItem('user'))
    const payload = {
        postId: postId,
        userId: userId
    }
    await fetch(BASE_URL + '/posts/like',
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
        .then(() => {
            drawPosts()
        })
        .catch(() => alert("Ошибка!"));
}




