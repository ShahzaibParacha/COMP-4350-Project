import {
    BrowserRouter as Router,
    Route,
    Navigate,
    Routes,
} from "react-router-dom";

import Home from "./components/home/home";
import Error from "./components/error/error.component";

import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact component={<Home/>}/>
                <Route path="/404" exact component={<Error/>}/>
                <Navigate to="/404" />
            </Routes>
        </Router>
    );
}

export default App;
