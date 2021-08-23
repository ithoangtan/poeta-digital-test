import WrappedLayout from './wrapped/WrappedLayout';
import './App.css';
import Products from './pages/Meals';

function App() {
  return (
    <WrappedLayout>
      <Products />
    </WrappedLayout>
  );
}

export default App;
