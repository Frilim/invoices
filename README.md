# React + Vite

This project requires:
- **Node.js v20.19.0**
- **npm v11.5.2**

## Node Version Manager (nvm) Installation
https://github.com/coreybutler/nvm-windows/releases

## Local Installation
1. Clone the repository:
   git clone https://github.com/Frilim/invoices.git
   cd my-project

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

4. Open [http://localhost:5173](http://localhost:5173) in your browser.


## Description
Application for invoice management with filters, form validation, and support for importing data via CSV.

## Import invoices from CSV
You can import invoices using the **Import CSV** button in the interface.

Example of a compatible file (`invoices.csv`):

```csv
invoiceNumber,clientName,date,amount,status
INV-001,Empresa Uno,2025-08-01,1500.50,1
INV-002,Empresa Dos,2025-08-03,2300.00,0
INV-003,Empresa Tres,2025-08-05,750.75,1
INV-004,Empresa Cuatro,2025-08-07,1200.00,0
```

## Main dependencies
- [CoreUI React Pro](https://coreui.io/react/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)
- [PapaParse](https://www.papaparse.com/)

## Project structure
src/
  ├── pages/
  └── services/

## Deployed link
[https://invoicesaf.netlify.app/](https://invoicesaf.netlify.app/)

## Contact
For support or suggestions, open an issue in the repository.
