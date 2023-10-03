import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "../util/slice/CartSlice";
import phoneReducer from "../util/slice/PhoneSlice"; // Import the phone slice reducer
import merchantReducer from "../util/slice/merchantSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};
const persistConfig2 = {
  key: "root1",
  storage,
};
const persistedReducer = persistReducer(persistConfig, merchantReducer);
const persistedCartReducer = persistReducer(persistConfig2, cartReducer);

const rootReducer = combineReducers({
  cart: persistedCartReducer,
  merchantReducer: persistedReducer,
  phone: phoneReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store);

export { store, persistor };
