
import './App.css';
import Nav from './components/header';
import Middle from './components/middleComponent';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
      <Middle/>
      <Routes>
      <Route path='/login' element={<h1>login</h1>}/>
      <Route path='/signup' element={<h1>signup</h1>}/>
      </Routes>
      </BrowserRouter>
   
    </div>
  );
}

export default App;
