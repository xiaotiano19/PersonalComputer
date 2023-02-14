import { legacy_createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['LoadingReducer']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = legacy_createStore(persistedReducer, composeWithDevTools())
const persistor = persistStore(store)
export { store, persistor }