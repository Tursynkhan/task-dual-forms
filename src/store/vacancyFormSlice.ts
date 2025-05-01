import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address, FormValuesVacancy as VacancyState } from "../types/Vacancy";

const initialState: VacancyState = {
  title: "",
  description: "",
  city: "",
  addresses: [{ city: "", street: "" }],
  salaryFrom: "",
  salaryTo: "",
  experience: "",
};

const vacancyFormSlice = createSlice({
  name: "vacancyForm",
  initialState: initialState,
  reducers: {
    updateField: (state, action: PayloadAction<Partial<VacancyState>>) => {
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

export const {
  updateField: updateVacancyField,
  addAddress: addVacancyAddress,
  updateAddress: updateVacancyAddress,
  removeAddress: removeVacancyAddress,
  resetForm: resetVacancyForm,
} = vacancyFormSlice.actions;

export default vacancyFormSlice.reducer;
