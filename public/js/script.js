document.addEventListener(
  "DOMContentLoaded",
  () => {
    
    const checkUser = document.getElementById("check-user")
    
    if (checkUser) {
      const navbarChange = document.getElementById("login-or-profile")
      navbarChange.innerHTML = `
            <a class="py-2 p-3 d-md-inline-block" href="/profile"><i class="fas fa-user"></i></a>
          <a class="py-2 p-3 d-md-inline-block" href="/auth/logout">Logout</a>
            `
    } else {
    
      const navbarChange = document.getElementById("login-or-profile")
      navbarChange.innerHTML = `
           <a class="py-2 p-3 nav-link " href="/auth/signup">Registrarse</a>
          <a class="py-2 p-3  nav-link " href="/auth/login">Iniciar Sesión</a>
            `
    }
  },
  false
);


