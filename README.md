# 💳 Proyecto Banco ACME

Aplicación web desarrollada para la autogestión de cuentas bancarias por parte de los usuarios del Banco ACME. Permite realizar operaciones bancarias básicas como consignaciones, retiros, pagos de servicios y consultar extractos, todo desde un entorno web responsive, intuitivo y seguro.

---

## 🚀 Funcionalidades Principales

### 🔐 Inicio de Sesión
- Autenticación con tipo y número de identificación + contraseña.
- Validación de credenciales.
- Redirección al Dashboard en caso de éxito.
- Opciones adicionales:
  - Crear cuenta.
  - Recuperar contraseña.

### 📝 Registro de Usuario
- Formulario con validación en tiempo real.
- Captura de datos personales (identificación, nombre, contacto, etc.).
- Asignación automática de número de cuenta y fecha de creación.
- Resumen de cuenta creada y acceso directo al inicio de sesión.

### 🔓 Recuperación de Contraseña
- Verificación mediante identificación y correo electrónico.
- Asignación de nueva contraseña si los datos coinciden.

---

## 📊 Dashboard

Interfaz principal tras iniciar sesión, desde donde se accede a las diferentes funciones de gestión de cuenta.

### Menú de opciones:

- **🏦 Resumen de Cuenta**  
  Muestra número de cuenta, saldo actual y fecha de creación.

- **📄 Resumen de Transacciones**  
  Lista de las últimas 10 transacciones realizadas con detalles completos y opción de impresión.

- **💰 Consignación Electrónica**  
  Permite ingresar dinero en la cuenta. Genera un resumen con fecha, valor, tipo y referencia.

- **🏧 Retiro de Dinero**  
  Permite retirar dinero del saldo disponible. Genera comprobante imprimible.

- **🔌 Pago de Servicios Públicos**  
  Selección de servicios (energía, agua, gas, Internet). Registra el pago y actualiza saldo.

- **📅 Extracto Bancario**  
  Consulta mensual por año y mes de todos los movimientos realizados.

- **📜 Certificado Bancario**  
  Genera un documento que certifica la titularidad de la cuenta. Incluye opción de impresión.

- **🚪 Cerrar Sesión**  
  Finaliza la sesión y redirige al inicio.

---

## 💾 Persistencia de Datos

- Uso de **LocalStorage** para simular base de datos.
- Estructuras de datos diseñadas en formato **JSON**.
- Gestión local de usuarios, transacciones, cuentas y autenticación.

---

## 🖌️ Diseño de la Interfaz

- **Responsive Design** compatible con móvil, tablet y escritorio.
- Tipografía moderna (Google Fonts).
- Paleta de colores corporativa: azul, blanco, gris.
- Componentes estilizados con diseño claro y profesional.
- Mensajes de éxito y error bien destacados.
- Tarjetas visuales para resumen de cuenta y comprobantes.

---

## 🧪 Tecnologías Utilizadas

- **HTML5**, **CSS3**, **JavaScript (Vanilla)**.
- DOM API para manejo dinámico de formularios y vistas.
- LocalStorage como método de almacenamiento persistente.

---

## 📁 Estructura del Proyecto

```
Proyecto_Banco/
├── assets/
│   ├── Captura desde 2025-07-16 16-11-39.png
│   └── Fondo_Banco.jpg
├── dashboard/
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── styles-dashboard.css
│   ├──
│   └── chatbot.js
├── landing/
│   ├── index-land.html
│   └── styles-land.css
├── recovery/
│   ├── recovery.html
│   └── styles-recovery.css
├── register/
│   ├── register.html
│   └── styles-register.css
├── index.html
├── qr-handler.js
├── script.js
├── styles.css
└── README.md
```


---

## 👥 Autores

Este proyecto fue desarrollado por:

- Santiago Mendoza
- Nicolás Florez
- Jhoxman Cárdenas

---

## 🛠️ Instrucciones de Uso

1. Clona el repositorio:
   ```bash
   git clone https://github.com/SantiagoMenR/ProyectoAcmebank_JavaScript_MendozaSantiago_FlorezNicolas_CardenasJhoxman-.git

2. Abre el archivo index.html en tu navegador.

3. ¡Explora las funcionalidades del banco ACME!

## 📌 Estado del Proyecto
- ✅ Funcionalidades completas
- ✅ Validaciones activas
- ✅ Interfaz adaptable
- ✅ Persistencia local con JSON

## 📄 Licencia
Este proyecto es de uso educativo y no representa una aplicación bancaria real.
© 2025 - Todos los derechos reservados a los autores.