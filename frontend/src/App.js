import {
    BrowserRouter,
    Route,
    Navigate,
    Routes,
} from "react-router-dom";

import Home from "./components/home/Home";
import Error from "./components/error/Error";
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/404" element={<Error/>}/>
                <Route path='*' element={<Navigate to="/404"/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
