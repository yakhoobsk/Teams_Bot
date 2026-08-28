import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider, App as AntdApp } from 'antd'
import { lightTheme } from "./theme";
import ErrorBoundary from './components/ErrorBoundary.tsx'
import SnackbarBridge from './components/SnackbarBridge.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={{ ...(lightTheme) }}>
        <AntdApp>
          <SnackbarBridge />
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
