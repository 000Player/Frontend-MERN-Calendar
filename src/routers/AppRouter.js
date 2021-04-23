import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import { startChecking } from "../actions/auth";
import { LoginScreen } from "../components/auth/LoginScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import ReactLoading from 'react-loading';
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

export const AppRouter = () => {
    
    const dispatch = useDispatch();
    const { checking, uid } = useSelector( state => state.auth );
    
    useEffect(() => {
        
        dispatch( startChecking() );

    }, [dispatch]);

    if ( checking ) {
        return (
            <ReactLoading
                type="spin"
                color="#3F51B5"
                height={'20%'} 
                width={'20%'}
                className="loading"
            />
        )
    }
    
    return (
        <Router>

            <div>
                <Switch>

                    <PublicRoute 
                        exact
                        path="/login"
                        component={ LoginScreen }
                        isAuthenticated={ !!uid }
                    />
                    <PrivateRoute 
                        exact 
                        path="/" 
                        component={ CalendarScreen } 
                        isAuthenticated={ !!uid }
                    />

                    <Redirect to="/" />

                </Switch>
            </div>
        
        </Router>
    )
}
