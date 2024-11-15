import { combineReducers } from '@reduxjs/toolkit'
import counterReducer from '../../src/redux/features/counterSlice'
import userReducer from '../../src/redux/features/userSlice'

export const store = combineReducers({   
      counter: counterReducer, 
      user: userReducer,
  });