const registerUser = document.querySelector("#register");

if (registerUser) {
  registerUser.addEventListener("submit", (event) => {
    event.preventDefault();
    const dataForRegister = {
      name: event.target.name.value,
      lastname: event.target.lastname.value,
      email: event.target.email.value,
      username: event.target.username.value,
      password: event.target.password.value,
    };
    fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForRegister),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          window.location.href = "http://localhost:4000/user";
        }
      })
      .catch((error) => console.error(error.message));
  });
}

const loginUser = document.querySelector("#login");

if (loginUser) {
  loginUser.addEventListener("submit", (event) => {
    event.preventDefault();
    const dataForLogin = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForLogin),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) window.location.href = "http://localhost:4000/user";
      })
      .catch((error) => console.error(error.message));
  });
}
