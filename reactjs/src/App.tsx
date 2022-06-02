import './App.css';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import { useIsLogin } from './redux/selectors/CommonSelectors';
import { BrowserRouter, Routes, Route, } from "react-router-dom";

function App() {

  const isLogin = useIsLogin();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          {!isLogin
            ? <Route path='/' element={<LoginScreen/>}/>
            : <Route path='/' element={<HomeScreen/>}/>
          }
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
