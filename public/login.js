const $ = (v) => document.querySelector(v);
const userName = $('#floatingInput')
const pass = $('#floatingPassword')
const form = $('#loginForm')
async function submit(e) {
    console.log('from login');
    e.preventDefault();
    const res = await (await fetch('/loginVerify', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: userName.value, pass: pass.value })
    })).json()
    if (res.status) {
        localStorage.setItem('login', userName.value)
        window.location = 'admin'
    }
}

form.addEventListener('submit', submit)