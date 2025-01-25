import './App.css'
import AppRoute from './routes/AppRoute'

import { store } from './store/store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
function App() {


  return (
    <>
      <Provider store={store}>
        <AppRoute />
        <ToastContainer />
      </Provider>
    </>
  )
}

export default App
