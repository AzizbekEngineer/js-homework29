let isLogin = localStorage.getItem('x-auth-token')
const logOut = document.querySelector('.header__logOut')


function checkUser() {
    if (!isLogin) {
        window.location.replace('/pages/login.html', '_self')
    }
}
checkUser()
logOut.addEventListener('click', () => {
    localStorage.clear()
    window.location.replace('/index.html', '_self')
})
