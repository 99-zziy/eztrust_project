import React from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import LandingPage from "./components/views/LandingPage/LandingPage"
import LoginPage from "./components/views/LoginPage/LoginPage"
import Footer from "./components/views/Footer/Footer"
import NavBar from "./components/views/NavBar/NavBar"
import SignUpPage from "./components/views/SignUpPage/SignUpPage"
import NotFoundPage from "./components/views/NotFound/NotFoundPage"
import {withAuthCheck} from "./hoc/authCheck"


function App() {
    return (
        <BrowserRouter>
            <div>
                <NavBar/>
                <Switch>
                    <Route exact path="/" component={withAuthCheck(LandingPage, null)}/>
                    <Route path="/login" component={withAuthCheck(LoginPage, false)}/>
                    <Route path="/sign_up" component={withAuthCheck(SignUpPage, false)}/>
                    <Route component={NotFoundPage}/>
                </Switch>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}


export default App;

