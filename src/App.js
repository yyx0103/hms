import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter
} from "react-router-dom";
import CreateAccount from "./components/signup";
import Button from "react-bootstrap/Button";
import Login from "./components/login";
import axios from "axios";
import EnhancedIssue from "./components/enhancedissue";
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

export const Auth = {
    isAuthenticated: false,
    token: "",
    username: "",
    async authenticate(userinfo, next) {
        await axios
            .get("http://localhost:5000/user/login", { headers: userinfo })
            .then(res => {
                if (res.data.success) {
                    this.token = res.data.token;
                    this.username = res.data.name;
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
                if (this.isAuthenticated) {
                    next(true);
                } else {
                    next(false);
                }
            })
            .catch(err => {
                this.isAuthenticated = false;
                next(false);
            });
    },
    signout(next) {
        this.isAuthenticated = false;
        this.token = "";
        next(this.isAuthenticated);
    }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            Auth.isAuthenticated === true ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
        }
    />
);

export const AuthButton = withRouter(({ history }) =>
    Auth.isAuthenticated ? (
        <p>
            <Button
                onClick={() => {
                    Auth.signout(() => history.push("/login"));
                }}
            >
                Sign out
            </Button>
        </p>
    ) : (
            <Button
                onClick={() => {
                    history.push("/login");
                }}
            >
                Login
        </Button>
        )
);

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    }
});

function App() {
    return (
        <Router>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <MuiThemeProvider theme={theme}>
                <PrivateRoute path="/issue" exact component={EnhancedIssue} />
            </MuiThemeProvider>
            <Route path="/signup" component={CreateAccount} />
        </Router>
    );
}

export default App;
