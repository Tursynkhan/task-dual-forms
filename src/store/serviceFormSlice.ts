import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormValuesService, Address } from "../types/Service";
import { postService } from "../api/api";

interface ServicesState {
  details: FormValuesService;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: ServicesState = {
  details: {
    description: "",
    city: "",
    addresses: [{ city: "", street: "" }],
    contactMethod: "",
    budget: "",
    budgetType: "",
    requirementsConfirmed: false,
    requirementsWithPhotos: false,
    requirementsWithReviews: false,
  },
  status: "idle",
  error: null,
};

export const postServiceForm = createAsyncThunk<
  { message: string; data: FormValuesService },
  FormValuesService,
  { rejectValue: string }
>("serviceForm/postServiceForm", async (form, { rejectWithValue }) => {
  try {
    const result = await postService(form);
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message || "Ошибка сети");
    }
    return rejectWithValue("Unknown error occurred");
  }
});

const serviceFormSlice = createSlice({
  name: "serviceForm",
  initialState,
  reducers: {
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
    setDetails(state, action: PayloadAction<FormValuesService>) {
      state.details = action.payload;
    },
    resetForm(state) {
      state.details = initialState.details;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postServiceForm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(postServiceForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data;
      })
      .addCase(postServiceForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Ошибка при отправке формы";
      });
  },
});

export const { setDetails, resetForm,updateAddress,removeAddress,addAddress } = serviceFormSlice.actions;
export default serviceFormSlice.reducer;
