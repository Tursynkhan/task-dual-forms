import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormValuesService as ServicesState, Address } from "../types/Service";

const initialState: ServicesState = {
  description: "",
  city: "",
  addresses: [{ city: "", street: "" }],
  contactMethod: "",
  budget: "",
  budgetType: "",
  requirementsConfirmed: false,
  requirementsWithPhotos: false,
  requirementsWithReviews: false,
};

const serviceFormSlice = createSlice({
  name: "serviceForm",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<Partial<ServicesState>>) => {
      Object.assign(state, action.payload);
    },
    addAddress: (state) => {
      state.addresses.push({ city: state.city, street: "" });
    },
    updateAddress: (
      state,
      action: PayloadAction<{ id: number; data: Address }>
    ) => {
      const { id, data } = action.payload;
      state.addresses[id] = data;
    },
    removeAddress: (state, action: PayloadAction<number>) => {
      state.addresses.splice(action.payload, 1);
    },
    resetForm: () => initialState,
  },
});

export const { updateField, addAddress, updateAddress, removeAddress, resetForm } = serviceFormSlice.actions;
export default serviceFormSlice.reducer;
