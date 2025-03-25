import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { privateRoute, publicRoute } from './Route';

const RoutesConfig = () => {
    const token = document.cookie ? document.cookie.split('=')[1] : null;
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded?.admin;
        } catch (error) {
            console.error('Invalid token', error);
        }
    }

    return (
        <Routes>
            {publicRoute.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
            {privateRoute.map((route, index) => {
                if (isAdmin) {
                    return <Route key={index} path={route.path} element={route.element} />;
                } else {
                    return <Route key={index} path="/" element={<Navigate to="/" />} />;
                }
            })}
        </Routes>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <RoutesConfig />
        </Router>
    </React.StrictMode>,
);

reportWebVitals();
