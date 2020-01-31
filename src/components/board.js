import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EnhancedIssue from './enhancedissue';
import HallOfFame from './halloffame';
import { Auth } from "../App";
import HomeIcon from '@material-ui/icons/Home';
import { FixedSizeList } from 'react-window';
import UserStats from './uinfo';
import axios from "axios";
import FamilyList from './familylist';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        color: 'inherit'
    },
    darkColor: {
        color: theme.palette.primary.dark,
        marginBottom: theme.spacing(3)
    },
    appBar: {
        colorSecondary: theme.palette.primary.dark,
    },
    appBarShift: {

    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        paddingLeft: theme.spacing(2),
        height: 320,
    },
    fixedLeft: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    },
}));

let obj2arr = (obj) => Object.keys(obj).map(function (key) {
    return [{ username: Number(key), count: obj[key] }];
});

let groupbyCount = (arr) => {
    let dict = {};
    for (const r of arr) {
        if (!dict[r]) {
            dict[r] = 0;
        }
        dict[r] += 1;
    }
    let rarr = []
    for (const k of Object.keys(dict)) {
        rarr.push({ username: k, count: dict[k] });
    }
    rarr = rarr.sort((o1, o2) => { return o2.count - o1.count; });
    return rarr;
}

export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />

                <main className={classes.content}>

                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={4} lg={5}>
                                <Paper className={fixedHeightPaper}>
                                    <Typography variant="h6" gutterBottom>
                                        {Auth.username.substr(Auth.username.indexOf("@") + 1) + " 的排行榜"}
                                    </Typography>
                                    <HallOfFame />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    <Typography variant="h6" gutterBottom>
                                        {Auth.username}
                                    </Typography>
                                    <UserStats />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                    <Typography variant="h6" gutterBottom>
                                        {"家庭成员"}
                                    </Typography>
                                    <FamilyList />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
        </ThemeProvider>
    );
}