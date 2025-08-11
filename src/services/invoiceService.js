import {create} from 'zustand';

export const useInvoiceService = create((set) => ({
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, invoice]
  })),
}));