const wrapper = document.querySelector('.likes')
let wishlist = JSON.parse(localStorage.getItem('wishlist'))
const sup = document.querySelector('sup')
sup.innerHTML = wishlist.length

let count = 0

function createCard(data) {
    let likes__cards = ""

    data.forEach((product) => {
        likes__cards += `
        <div class="likes__card" data-id=${product.id}>
            <img class="likes__card__image"  src=${product.images[0]} alt="">
            <h3>${product.title}</h3>
            <p>${product.price} USD</p>
            <button>Buy now</button>
            <i class="fa-regular fa-heart"></i>
        </div>
        `
    })
    wrapper.innerHTML = likes__cards
}
createCard(wishlist)

const addToWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist'))
    let updateWishlist = wishlist.filter(el => el.id !== +id)
    localStorage.setItem('wishlist', JSON.stringify(updateWishlist))
    createCard(updateWishlist)
}
wrapper.addEventListener("click", (e) => {
    if (e.target.className === "likes__card__image") {
        let id = e.target.closest('.likes__card').dataset.id
        window.open(`./pages/product.html?productId=${id}`, "_self")
    } else if (e.target.className.includes("fa-heart")) {
        let id = e.target.closest('.likes__card').dataset.id
        addToWishlist(id)
    }
})


