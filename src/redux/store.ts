import { configureStore } from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'

import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/es/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist"

import { authTransform } from '../utils/authTransform'


const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [authTransform],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch