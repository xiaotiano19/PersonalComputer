import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import IndexRouter from './router/indexRouter'
import { store,persistor } from './redux/store'
import './App.css'
export default function App() {
  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  )
}
