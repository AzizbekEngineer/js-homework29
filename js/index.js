let wrapper = document.querySelector('.cards')
const btnSeeMore = document.querySelector('.btn__se-more')
const loading = document.querySelector('.loading')
let cards = document.querySelector('.cards')
const headerLogin = document.querySelector('.header__login')
const modal = document.querySelector('.modal')
const back = document.querySelector('.back')
const modalClose = document.querySelector('.modal__close')
let sup = document.querySelector('sup')
console.log(sup.innerHTML);
let countLike = 0

const API_URL = 'https://dummyjson.com'


let limitCount = 8
let count = 1


async function fetchData(URL) {
    const data = await fetch(`${URL}/products?limit=${limitCount * count}`)
    console.log(data);
    data
        .json()
        .then(res => createCardProduct(res))
        .catch(err => console.log(err))
        .finally(() => {
            loading.style.display = 'none'
            btnSeeMore.innerHTML = 'See More'
            btnSeeMore.removeAttribute('disabled')
        })
}
fetchData(API_URL)


function createCardProduct(data) {
    console.log(data);
    let cards = ''
    data.products.forEach(product => {
        cards += `
                <div class="card" data-id=${product.id}>
                    <div class="card__img">
                        <img src="${product.images[0]}" alt="">
                    </div>
                    <div class="card__icons">
                        <div class="card__icons__img">
                            <img src="./images/savat.svg" alt="">
                        </div>
                        <div class="card__icons__img_heart">
                            <i class="fa-regular fa-heart"></i>
                        </div>
                        <div class="card__icons__img">
                            <img src="./images/search.svg" alt="">
                        </div>
                    </div>
                    <h3 class="card__title">${product.title}</h3>
                    <p class="card__price">Price: ${product.price}$  <span class="card__price__old"> ${product.price * 2}$</span></p>
                    <button class="btn">More Info</button>
                </div>
        `
    });
    wrapper.innerHTML = cards
}

function createLoad(count) {
    let loadingCards = ''
    for (let i = 0; i < count; i++) {
        loadingCards += `
         <div class="loading__item">
            <div class="loading__img bg__animation"></div>
            <div class="loading__title bg__animation"></div>
            <div class="loading__title bg__animation"></div>
        </div>
        `
    };
    loading.innerHTML = loadingCards

}
createLoad(limitCount)

/* like start */
const addToWishlist = async (id) => {
    let data = await fetch(`${API_URL}/products/${id}`)
    data
        .json()
        .then(product => {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || []

            let index = wishlist.findIndex(el => el.id === product.id)
            let updateWishlist = []

            if (index < 0) {
                updateWishlist = [...wishlist, product]
                countLike += 1
            } else {
                updateWishlist = wishlist.filter(el => el.id !== product.id)
                countLike -= 1
            }
            sup.innerHTML = countLike
            localStorage.setItem('wishlist', JSON.stringify(updateWishlist))


            console.log('sup>>', sup);
        })
        .catch(err => console.log(err))
}

wrapper.addEventListener("click", (e) => {
    if (e.target.className === "card__image") {
        let id = e.target.closest('.card').dataset.id
        window.open(`./pages/product.html?productId=${id}`, "_self")
    } else if (e.target.className.includes("fa-heart")) {
        let id = e.target.closest('.card').dataset.id
        addToWishlist(id)
    }
})



/* like end */


btnSeeMore.addEventListener('click', () => {
    count++
    fetchData(API_URL)
    btnSeeMore.innerHTML = 'Loading....'
    btnSeeMore.setAttribute('disabled', true)
})
cards.addEventListener('click', (e) => {
    if (e.target.className === "btn") {
        let id = e.target.dataset.id
        window.open(`./pages/product.html?productId=${id}`, '_self')
    }
})
headerLogin.addEventListener('click', () => {
    modal.style.display = 'flex'
    back.style.display = 'block'
})
back.addEventListener('click', () => {
    modal.style.display = 'none'
    back.style.display = 'none'
})
modalClose.addEventListener('click', () => {
    modal.style.display = 'none'
    back.style.display = 'none'
})

/* Admin */
const form = document.querySelector('.form')
const userName = document.querySelector('.username')
const password = document.querySelector('.password')
const API_URLL = 'https://dummyjson.com'
let user = {}

form.addEventListener('submit', (e) => {
    console.log('ok');
    e.preventDefault()
    user = {
        username: userName.value,
        password: password.value
    }
    signIn(user)
})

async function signIn(user) {
    await fetch(`${API_URLL}/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(res => {
            console.log('res>>', res);
            if (res.message === 'Invalid credentials') {
                return alert('username or password is incorrect')
            }
            localStorage.setItem('x-auth-token', res.token)
            window.open('/pages/admin.html', '_self')

        })
        .catch(err => console.log('err>>', err))
}

/* Select and search */
let cotigories = document.querySelector('#cotigories')
let select = document.querySelector('.select')
const inputSearch = document.querySelector('.serach__value')

async function fetchCotigoris(URL) {
    let data = await fetch(`${URL}/products/categories`)
    data
        .json()
        .then(res => createSelect(res))
        .catch(err => console.log(err))
}
fetchCotigoris(API_URL)

function createSelect(data) {
    let selects = `
        <option value="all">all</option>
    `
    data.forEach(option => {
        selects += `
        <option value="${option}">${option}</option>
       `
    })
    select.innerHTML = selects
}


async function fetchProducts(URL, option, searchValue) {
    let url = ''
    if (option === 'all') {
        if (searchValue) {
            url = `${URL}/products/search/?q=${searchValue}`
        } else {
            url = `${URL}/products`
        }
    } else {
        url = `${URL}/products/category/${option}?limit=8`
    }
    console.log(url);
    const data = await fetch(url, {
        method: "GET"
    })

    data
        .json()
        .then(res => createCardProduct(res))
        .catch(err => console.log(err))
        .finally(() => {

        })
}

fetchProducts(API_URL, 'all')
select.addEventListener('change', (e) => {
    let product = e.target.value
    fetchProducts(API_URL, product)
})
inputSearch.addEventListener('input', (e) => {
    console.log(e.target.value);
    let value = e.target.value.trim()
    if (value) {
        fetchProducts(API_URL, 'all', value)
        select.value = 'all'
    }
})





