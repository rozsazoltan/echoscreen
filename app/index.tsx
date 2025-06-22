import { ipcRenderer } from 'electron';
import React, { Fragment, Suspense, Component } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import './configs/i18next.config.client';
import { history, configuredStore } from './store';
import './app.global.css';

const store = configuredStore();

// Error Boundary komponens
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    ipcRenderer.send('renderer-error', { error: error.toString(), errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong</h2>
          <p>Please restart the application</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

// MacOS-specifikus drag terület
const setupMacOSDragArea = () => {
  if (process.platform === 'darwin') {
    const windowTopBar = document.createElement('div');
    Object.assign(windowTopBar.style, {
      width: '100%',
      height: '50px',
      position: 'absolute',
      top: '0',
      left: '0',
      // @ts-ignore: Electron specifikus tulajdonság
      webkitAppRegion: 'drag',
      pointerEvents: 'none'
    });
    document.body.appendChild(windowTopBar);
  }
};

// Alkalmazás betöltése
const loadApp = async () => {
  try {
    setupMacOSDragArea();

    // Dinamikus import a Root komponenshez
    const { default: Root } = await import('./containers/Root');

    render(
      <AppContainer>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Root store={store} history={history} />
          </Suspense>
        </ErrorBoundary>
      </AppContainer>,
      document.getElementById('root')
    );
  } catch (error) {
    console.error('Failed to load app:', error);
    ipcRenderer.send('renderer-error', { error: error.toString() });

    render(
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Failed to load application</h2>
        <p>Please try again or contact support</p>
      </div>,
      document.getElementById('root')
    );
  }
};

document.addEventListener('DOMContentLoaded', loadApp);

window.onbeforeunload = () => {
  ipcRenderer.invoke('main-window-onbeforeunload').catch(console.error);
};
