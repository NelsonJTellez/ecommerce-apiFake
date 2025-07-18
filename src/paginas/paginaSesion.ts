import { Sesion } from "../funcionalidades/autenticacion/sesionSingleton";
import { validarContraseña } from "../funcionalidades/autenticacion/validarContra";
import { existeUsuario, registrarUsuario } from "../servicios/api";

export function renderizarPaginaSesion(contenedor: HTMLElement) {
  contenedor.innerHTML = `
    <section class="sesion-container">
      <div class="tabs">
        <button class="tab-button active" data-tab="login">Iniciar sesión</button>
        <button class="tab-button" data-tab="register">Registrarse</button>
      </div>
      <div class="tab-content active" id="login">
        <form id="form-login" class="form">
          <label for="login-usuario">Usuario</label>
          <input type="text" id="login-usuario" required autocomplete="username" />
          <label for="login-contrasena">Contraseña</label>
          <div class="password-wrapper">
            <input type="password" id="login-contrasena" required autocomplete="current-password" />
            <button type="button" class="toggle-password" aria-label="Mostrar/Ocultar contraseña" tabindex="-1">
              <span class="icon-eye">...</span>
              <span class="icon-eye-off" style="display:none">...</span>
            </button>
          </div>
          <button type="submit" class="btn-menu">Entrar</button>
          <p id="error-login" class="error"></p>
        </form>
      </div>
      <div class="tab-content" id="register">
        <form id="form-register" class="form">
          <label for="register-usuario">Usuario</label>
          <input type="text" id="register-usuario" required autocomplete="username" />
          <label for="register-contrasena">Contraseña</label>
          <div class="password-wrapper">
            <input type="password" id="register-contrasena" required autocomplete="new-password" />
            <button type="button" class="toggle-password" aria-label="Mostrar/Ocultar contraseña" tabindex="-1">
              <span class="icon-eye">...</span>
              <span class="icon-eye-off" style="display:none">...</span>
            </button>
          </div>
          <label for="register-contrasena2">Confirmar Contraseña</label>
          <div class="password-wrapper">
            <input type="password" id="register-contrasena2" required autocomplete="new-password" />
            <button type="button" class="toggle-password" aria-label="Mostrar/Ocultar contraseña" tabindex="-1">
              <span class="icon-eye">...</span>
              <span class="icon-eye-off" style="display:none">...</span>
            </button>
          </div>
          <button type="submit" class="btn-menu">Registrar</button>
          <p id="error-register" class="error"></p>
        </form>
      </div>
    </section>
    <style>
      .password-wrapper {
        display: flex;
        align-items: center;
        position: relative;
      }
      .password-wrapper input[type="password"],
      .password-wrapper input[type="text"] {
        flex: 1;
        padding-right: 2.3em;
      }
      .toggle-password {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: -2em;
        z-index: 2;
        display: flex;
        align-items: center;
        color: #888;
        padding: 0;
        height: 100%;
        width: 2em;
        justify-content: center;
      }
      .toggle-password:focus {
        outline: none;
        color: #222;
      }
      .icon-eye-off {
        display: none;
      }
    </style>
  `;

  // Toggle ver/ocultar contraseña (igual que antes)
  const passwordToggles = contenedor.querySelectorAll<HTMLButtonElement>('.toggle-password');
  passwordToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement!.querySelector('input')!;
      const iconEye = btn.querySelector<HTMLElement>('.icon-eye')!;
      const iconEyeOff = btn.querySelector<HTMLElement>('.icon-eye-off')!;
      if (input.type === "password") {
        input.type = "text";
        iconEye.style.display = "none";
        iconEyeOff.style.display = "inline";
      } else {
        input.type = "password";
        iconEye.style.display = "inline";
        iconEyeOff.style.display = "none";
      }
    });
  });

  // Pestañas igual...
  const tabButtons = contenedor.querySelectorAll<HTMLButtonElement>(".tab-button");
  const tabContents = contenedor.querySelectorAll<HTMLDivElement>(".tab-content");
  tabButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      contenedor.querySelector(`#${tab}`)?.classList.add("active");
    })
  );

  // --- Login ---
  const formLogin = document.getElementById("form-login") as HTMLFormElement;
  const errorLogin = document.getElementById("error-login") as HTMLElement;
  const loginUsuario = document.getElementById("login-usuario") as HTMLInputElement;
  const loginContrasena = document.getElementById("login-contrasena") as HTMLInputElement;
  [loginUsuario, loginContrasena].forEach((input) =>
    input.addEventListener("input", () => { errorLogin.textContent = ""; })
  );
  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    const usuario = loginUsuario.value.trim();
    const contrasena = loginContrasena.value;
    // Evitar login duplicado ¡¡AQUÍ EL CAMBIO!!
    if (localStorage.getItem("session_locked")) {
      errorLogin.textContent = "Ya hay una sesión activa de este usuario en otra pestaña/ventana.";
      return;
    }
    if (!usuario) {
      errorLogin.textContent = "El usuario es obligatorio."; return;
    }
    if (!validarContraseña(contrasena)) {
      errorLogin.textContent = "La contraseña debe tener mínimo 9 caracteres, incluyendo mayúsculas, minúsculas y un símbolo."; return;
    }
    try {
      const userObj = await existeUsuario(usuario);
      if (!userObj) { errorLogin.textContent = "Usuario no registrado."; return; }
      if (userObj.password !== contrasena) { errorLogin.textContent = "Contraseña incorrecta."; return; }
      try {
        Sesion.obtenerInstancia().iniciarSesion(usuario);
        location.hash = "#/";
      } catch (e: any) {
        errorLogin.textContent = e.message || "Sesión duplicada detectada.";
      }
    } catch (err) {
      errorLogin.textContent = "Error al contactar el servidor";
    }
  };

  // --- Registro igual que antes ...
  const formRegister = document.getElementById("form-register") as HTMLFormElement;
  const errorRegister = document.getElementById("error-register") as HTMLElement;
  const registerUsuario = document.getElementById("register-usuario") as HTMLInputElement;
  const registerContrasena = document.getElementById("register-contrasena") as HTMLInputElement;
  const registerContrasena2 = document.getElementById("register-contrasena2") as HTMLInputElement;
  [registerUsuario, registerContrasena, registerContrasena2].forEach((input) =>
    input.addEventListener("input", () => { errorRegister.textContent = ""; })
  );
  formRegister.onsubmit = async (e) => {
    e.preventDefault();
    const usuario = registerUsuario.value.trim();
    const contrasena = registerContrasena.value;
    const contrasena2 = registerContrasena2.value;
    if (!usuario) {
      errorRegister.textContent = "El usuario es obligatorio."; return;
    }
    if (!validarContraseña(contrasena)) {
      errorRegister.textContent = "La contraseña debe tener mínimo 9 caracteres, incluyendo mayúsculas, minúsculas y un símbolo."; return;
    }
    if (contrasena !== contrasena2) {
      errorRegister.textContent = "Las contraseñas no coinciden."; return;
    }
    try {
      const yaExiste = await existeUsuario(usuario);
      if (yaExiste) { errorRegister.textContent = "Ese usuario ya existe. Elige otro."; return; }
      await registrarUsuario({ usuario, password: contrasena });
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      contenedor.querySelector(`[data-tab="login"]`)?.classList.add("active");
      contenedor.querySelector(`#login`)?.classList.add("active");
      registerUsuario.value = "";
      registerContrasena.value = "";
      registerContrasena2.value = "";
      const errorLogin = document.getElementById("error-login") as HTMLElement;
      errorLogin.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
    } catch (err) {
      errorRegister.textContent = "Error al contactar el servidor";
    }
  };
}
