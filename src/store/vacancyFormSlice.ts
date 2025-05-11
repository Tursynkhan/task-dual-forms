import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address, FormValuesVacancy } from "../types/Vacancy";
import { postVacancy } from "../api/api";
interface VacancyState {
  details: FormValuesVacancy;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: VacancyState = {
  details: {
    title: "",
    description: "",
    city: "",
    addresses: [{ city: "", street: "" }],
    salaryFrom: "",
    salaryTo: "",
    experience: "",
  },
  status: "idle",
  error: null,
};

export const postVacancyForm = createAsyncThunk<
  { message: string; data: FormValuesVacancy },
  FormValuesVacancy,
  { rejectValue: string }
>("vacancyForm/postVacancyForm", async (form, { rejectWithValue }) => {
  try {
    const result = await postVacancy(form);
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message || "Ошибка сети");
    }
    return rejectWithValue("Unknown error occurred");
  }
});

const vacancyFormSlice = createSlice({
  name: "vacancyForm",
  initialState: initialState,
  reducers: {
    setDetails(state, action: PayloadAction<FormValuesVacancy>) {
      state.details = action.payload;
    },
    addAddress: (state) => {
      state.details.addresses.push({ city: state.details.city, street: "" });
    },
    updateAddress: (
      state,
      action: PayloadAction<{ id: number; data: Address }>
    ) => {
      const { id, data } = action.payload;
      state.details.addresses[id] = data;
    },
    removeAddress: (state, action: PayloadAction<number>) => {
      state.details.addresses.splice(action.payload, 1);
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postVacancyForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postVacancyForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data;
      })
      .addCase(postVacancyForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const {
  setDetails,
  addAddress: addVacancyAddress,
  updateAddress: updateVacancyAddress,
  removeAddress: removeVacancyAddress,
  resetForm: resetVacancyForm,
} = vacancyFormSlice.actions;

export default vacancyFormSlice.reducer;
