const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const gosignup = document.getElementById("gosignup");
const gologin = document.getElementById("gologin");

const API_URL = "http://localhost:3000/auth";

gologin.addEventListener("click", function () {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

gosignup.addEventListener("click", function () {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
});

async function sendJson(url, payload) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    let data;
    try {
        data = await res.json();
    } catch {
        data = { message: "Server noto'g'ri javob qaytardi" };
    }

    if (!res.ok) {
        throw new Error(data.message || "So'rov bajarilmadi");
    }

    return data;
}

document.getElementById("signupSubmit").addEventListener("click", async function () {
    const username = document.querySelector("#signupForm input[type='text']").value.trim();
    const email = document.querySelector("#signupForm input[type='email']").value.trim();
    const password = document.querySelector("#signupForm input[type='password']").value.trim();

    if (!username || !email || !password) {
        alert("Barcha maydonlarni to'ldiring!");
        return;
    }

    try {
        const data = await sendJson(`${API_URL}/register`, { username, email, password });
        alert(data.message);
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    } catch (error) {
        alert(`Xato: ${error.message}`);
        console.error(error);
    }
});

document.getElementById("loginSubmit").addEventListener("click", async function () {
    const email = document.querySelector("#loginForm input[type='email']").value.trim();
    const password = document.querySelector("#loginForm input[type='password']").value.trim();

    if (!email || !password) {
        alert("Email va parolni kiriting!");
        return;
    }

    try {
        const data = await sendJson(`${API_URL}/login`, { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Xush kelibsiz, ${data.user.username}!`);
    } catch (error) {
        alert(`Xato: ${error.message}`);
        console.error(error);
    }
});
