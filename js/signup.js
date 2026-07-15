const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const fullname = document.getElementById("fullname").value;

const email = document.getElementById("email").value;

const password = document.getElementById("password").value;

const { data, error } = await supabase.auth.signUp({

email,

password,

options: {

data: {

fullname

}

}

});

if (error) {

alert(error.message);

return;

}

alert("Account created successfully. Please check your email.");

window.location = "login.html";

}) 