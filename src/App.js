import React from 'react';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import './App.css';
import { store } from './database.js';
import Home from './views/home.js';
import Crew from './views/crew.js';
import Drifter from './views/drifter.js';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/crew/:wallet" element={<Crew />} />
                    <Route path="/drifter/:tokenId" element={<Drifter />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
