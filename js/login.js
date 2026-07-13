const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("email").value;

const password = document.getElementById("password").value;

const { data, error } = await supabase.auth.signInWithPassword({

email,

password

});

if (error) {

alert(error.message);

return;

}

window.location = "dashboard.html";

});