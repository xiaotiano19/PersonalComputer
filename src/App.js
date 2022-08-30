import React from 'react'
import './App.css'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import IndexRouter from './router/indexRouter'
import { PersistGate } from 'redux-persist/integration/react'
export default function App() {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <IndexRouter></IndexRouter>
    </PersistGate>
  </Provider> //去掉div让结构扁平化
}

