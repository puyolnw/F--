import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import './styles/theme.css';
import './components/components.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;