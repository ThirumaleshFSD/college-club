import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
} from './reducers/userReducers';
import {
  clubListReducer,
  clubDetailsReducer,
  clubCreateReducer,
  clubJoinReducer,
} from './reducers/clubReducers';

const reducer = {
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  clubList: clubListReducer,
  clubDetails: clubDetailsReducer,
  clubCreate: clubCreateReducer,
  clubJoin: clubJoinReducer,
};

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
  devTools: composeWithDevTools(),
});

export default store;