import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';
import { Auth } from '../App';
import { withRouter } from "react-router";


const styles = (theme => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    }
}));

const path2tab = {'/dash': 1, '/issue': 2, '/signup': 0, '/login': 0, '/': 0};

class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: path2tab[this.props.location.pathname],
        };
        this.onChangeTabIndex = this.onChangeTabIndex.bind(this)
    }
    onChangeTabIndex(e, index) {
        this.setState({ tabIndex: index });
    }
    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="lg" className={classes.container}>
    
                <Tabs
                    value={this.state.tabIndex}
                    onChange={this.onChangeTabIndex}
                >
                    <Tab key={"Sign Out"}
                        label={"Sign Out"}
                        className={classes.tabLink}
                        component={RouterLink}
                        to={'/login'}
                        onClick={() => { Auth.signout(() => { }) }} />
                    <Tab key={"Family Profile"}
                        label={"Family Profile"}
                        className={classes.tabLink}
                        component={RouterLink}
                        to={'/dash'} />
                    <Tab key={"Task Board"}
                        label={"Task Board"}
                        className={classes.tabLink}
                        component={RouterLink}
                        to={'/issue'} />
    
                </Tabs>
            </Container>
        );
    }
    
};

export default withStyles(styles)(withRouter(Navbar));