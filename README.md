# React + Vite

Este proyecto requiere:
- **Node.js v20.19.0**
- **npm v11.5.2**

## instalación Node version manager(nvm)
https://github.com/coreybutler/nvm-windows/releases

## Instalación local
1. Clona el repositorio:
   git clone https://github.com/Frilim/invoices.git
   cd my-project

2. Instala las dependencias:
   npm install

3. Inicia el servidor de desarrollo:
   npm run dev

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.


## Descripción
Aplicación para gestión de facturas con filtros, validación de formularios y soporte para importación de datos vía CSV.

## Importar facturas desde CSV
Puedes importar facturas usando el botón **Import CSV** en la interfaz.

Ejemplo de archivo compatible (`invoices.csv`):

```csv
invoiceNumber,clientName,date,amount,status
INV-001,Empresa Uno,2025-08-01,1500.50,1
INV-002,Empresa Dos,2025-08-03,2300.00,0
INV-003,Empresa Tres,2025-08-05,750.75,1
INV-004,Empresa Cuatro,2025-08-07,1200.00,0
```

## Principales dependencias
- [CoreUI React Pro](https://coreui.io/react/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)
- [PapaParse](https://www.papaparse.com/)

## Estructura del proyecto
src/
  ├── pages/
  └── services/

## Contacto
Para soporte o sugerencias, abre un issue en el repositorio.
