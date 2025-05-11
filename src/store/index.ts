import { configureStore } from "@reduxjs/toolkit";
import serviceFormReducer from "./serviceFormSlice";
import vacancyFormReducer from "./vacancyFormSlice";
import { serviceApi } from "./serviceApi";
import { vacancyApi } from "./vacancyApi";

export const store = configureStore({
  reducer: {
    serviceForm: serviceFormReducer,
    vacancyForm: vacancyFormReducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [vacancyApi.reducerPath]: vacancyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(serviceApi.middleware)
      .concat(vacancyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
