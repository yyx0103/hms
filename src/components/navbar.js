import React, { useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';
import { Auth } from '../App';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    }
}));


const Navbar = (props) => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.container}>

            <Tabs
                value={tabIndex}
                onChange={(e, index) => setTabIndex(index)}
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
};

export default Navbar;