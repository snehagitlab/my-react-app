import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './pages/App'
import 'babel-polyfill';


const rootElement = document.getElementById('root');

// use createRoot to render your app
const root = ReactDOM.createRoot(rootElement);
root.render(<Router>
  <App />
</Router>);
