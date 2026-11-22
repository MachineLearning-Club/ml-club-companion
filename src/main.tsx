import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
registerSW({immediate:true,onNeedRefresh(){console.info('A new version is ready to activate.');},onOfflineReady(){console.info('ML Club Companion ready for offline use.')}});
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
