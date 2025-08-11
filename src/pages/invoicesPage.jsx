import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { useInvoiceService } from '../services/invoiceService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormInput, CFormSelect, CFormLabel, CForm, CRow, CCol,} from "@coreui/react-pro";
import { handleCSVFile } from '../services/csvImportService';

// Validación Yup para el formulario
const InvoiceSchema = Yup.object().shape({
  clientName: Yup.string().required('Client Name is required'),
  date: Yup.date().required('Date is required'),
  amount: Yup.number().positive('Amount must be greater than 0').required('Amount is required'),
  status: Yup.string().oneOf(['0', '1'], 'Invalid Status').required('Status is required'),
});

const filterDate = (dateStr, from, to) => {
  const date = new Date(dateStr);
  if (from && date < new Date(from)) return false;
  if (to && date > new Date(to)) return false;
  return true;
};

export default function InvoicesPage() {
  const invoices = useInvoiceService(state => state.invoices);
  const addInvoice = useInvoiceService(state => state.addInvoice);
  const setInvoices = useInvoiceService(state => state.setInvoices);

  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(() => [
    { headerName: 'Invoice Number', field: 'invoiceNumber', sortable: true, filter: true },
    { headerName: 'Client Name', field: 'clientName', sortable: true, filter: true },
    { headerName: 'Date', field: 'date', sortable: true, filter: true },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      valueFormatter: params => (params.value === '1' || params.value === 1 ? 'Paid' : 'Unpaid')
    },
    {
      headerName: 'Amount (USD)',
      field: 'amount',
      sortable: true,
      filter: true,
      type: 'numberColumn',
      valueFormatter: params => `$${Number(params.value).toFixed(2)}`
    },
  ], []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const statusMatch = statusFilter ? inv.status === statusFilter : true;
      const dateMatch = filterDate(inv.date, dateFrom, dateTo);
      return statusMatch && dateMatch;
    });
  }, [invoices, statusFilter, dateFrom, dateTo]);

  // Genera un número de factura incremental
  const generateInvoiceNumber = () => {
    const maxNumber = invoices.reduce((max, inv) => {
      const num = parseInt(inv.invoiceNumber.replace(/\D/g, ''), 10);
      return num > max ? num : max;
    }, 0);
    return `INV-${(maxNumber + 1).toString().padStart(3, '0')}`;
  };

  const handleSubmit = (values, { resetForm }) => {
    const newInvoice = {
      invoiceNumber: generateInvoiceNumber(),
      clientName: values.clientName,
      date: values.date,
      amount: Number(values.amount),
      status: values.status,
    };
    addInvoice(newInvoice);
    resetForm();
    setModalOpen(false);
  };

  const onCSVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCSVFile(file, (data) => {
        setInvoices(data);
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <CFormLabel className="block text-sm font-medium mb-1">Status Filter</CFormLabel>
          <CFormSelect
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1"
            style={{ backgroundColor: '#cdd0d4ff' }}
          >
            <option value="">All</option>
            <option value="1">Paid</option>
            <option value="0">Unpaid</option>
          </CFormSelect>
        </div>

        <div>
          <CFormLabel className="block text-sm font-medium mb-1">Date From</CFormLabel>
          <CFormInput
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="border rounded px-2 py-1"
            style={{ backgroundColor: '#cdd0d4ff' }}
          />
        </div>

        <div>
          <CFormLabel className="block text-sm font-medium mb-1">Date To</CFormLabel>
          <CFormInput
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="border rounded px-2 py-1"
            style={{ backgroundColor: '#cdd0d4ff' }}
          />
        </div>

        <CButton
          color="primary"
          onClick={() => setModalOpen(true)}
          className="ml-auto"
        >
          Add Invoice
        </CButton>
        <label>
          <input
            type="file"
            accept=".csv"
            onChange={onCSVChange}
            style={{ display: 'none' }}
            id="csv-upload"
          />
          <CButton color="success" className="ml-2" onClick={() => document.getElementById('csv-upload').click()}>
            Import CSV
          </CButton>
        </label>
      </div>

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={filteredInvoices}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={20}
          domLayout="autoHeight"
        />
      </div>

      {/* Modal */}
      <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
        <CModalHeader onClose={() => setModalOpen(false)}>
          <CModalTitle>Add New Invoice</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            clientName: '',
            date: '',
            amount: '',
            status: '',
          }}
          validationSchema={InvoiceSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <CModalBody>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="clientName">Client Name</CFormLabel>
                    <Field
                      as={CFormInput}
                      name="clientName"
                      type="text"
                      id="clientName"
                      style={{ backgroundColor: '#cdd0d4ff' }}
                    />
                    <ErrorMessage name="clientName" component="div" className="text-red-600 text-sm" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="date">Date</CFormLabel>
                    <Field
                      as={CFormInput}
                      name="date"
                      type="date"
                      id="date"
                      style={{ backgroundColor: '#cdd0d4ff' }}
                    />
                    <ErrorMessage name="date" component="div" className="text-red-600 text-sm" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="amount">Amount (USD)</CFormLabel>
                    <Field
                      as={CFormInput}
                      name="amount"
                      type="number"
                      step="0.01"
                      id="amount"
                      style={{ backgroundColor: '#cdd0d4ff' }}
                    />
                    <ErrorMessage name="amount" component="div" className="text-red-600 text-sm" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="status">Status</CFormLabel>
                    <Field
                      as={CFormSelect}
                      name="status"
                      id="status"
                      style={{ backgroundColor: '#cdd0d4ff' }}
                    >
                      <option value="">Select status</option>
                      <option value="1">Paid</option>
                      <option value="0">Unpaid</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-600 text-sm" />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={isSubmitting}>
                  Save
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModal>
    </div>
  );
}