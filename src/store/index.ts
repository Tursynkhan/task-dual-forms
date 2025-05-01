import { configureStore } from "@reduxjs/toolkit";
import serviceFormReducer from "./serviceFormSlice";
import vacancyFormReducer from "./vacancyFormSlice";

export const store = configureStore({
  reducer: {
    serviceForm: serviceFormReducer,
    vacancyForm: vacancyFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
