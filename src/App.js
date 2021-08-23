import WrappedLayout from './wrapped/WrappedLayout';
import './App.css';
import Meals from './pages/Meals';

function App() {
  return (
    <WrappedLayout>
      <Meals />
    </WrappedLayout>
  );
}

export default App;
