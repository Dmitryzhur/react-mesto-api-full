import React from "react";
import { Route, Redirect } from "react-router-dom";

// Компонент принимает другой в качестве пропса
const ProtectedRoute = ({ component: Component, ...props }) => {
	return (
		<Route>
			{
				() => props.loggedIn === true ? <Component {...props} /> : <Redirect to="/sign-in" />
			}
		</Route>
	)
};

export default ProtectedRoute;