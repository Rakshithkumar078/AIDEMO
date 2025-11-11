import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import AppRoute from './config/app-route.tsx';

// bootstrap
import 'bootstrap';

// css
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './scss/react.scss';
import 'bootstrap-social/bootstrap-social.css';
// TODO remove the Style.css
import '../src/shared/styles/Style.css';


const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
	<BrowserRouter>
		<AppRoute />
	</BrowserRouter>
);
