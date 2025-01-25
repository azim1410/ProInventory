import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/Auth/AuthSlice";
import storeSlice from "../features/Stores/StoreSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch