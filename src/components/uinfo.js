import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import axios from 'axios';
import { Auth } from '../App';

const BorderLinearProgress = withStyles({
    root: {
        height: 10,
        backgroundColor: lighten('#ff6c5c', 0.5),
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#ff6c5c',
    },
})(LinearProgress);

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function UserStats() {
    const classes = useStyles();
    const [info, setInfo] = React.useState([]);

    React.useEffect(() => {
        axios.get("http://localhost:5000/task/", { headers: { Authorization: "Bearer " + Auth.token } }).then((response) => {
            let dictExec = response.data.filter(o => o.executor && o.isFinished).map(o => { return o.executor; });
            let youFinished = dictExec.filter(o => { return o === Auth.username; }).length;
            let dictIss = response.data.filter(o => o.executor && !o.isFinished).map(o => { return o.executor; });
            let youIss = dictIss.filter(o => { return o === Auth.username; }).length;
            let dictPost = response.data.map(o => { return o.username; });
            let youPost = dictPost.filter(o => { return o === Auth.username; }).length;
            setInfo([{ title: "Total Finished", num: youFinished, frac: (dictExec.length !== 0) ? (youFinished / dictExec.length) * 100 : 0 },
            { title: "Total Executing", num: youIss, frac: (dictIss.length !== 0) ? (youIss / dictIss.length) * 100 : 0 },
            { title: "Total Posted", num: youPost, frac: (dictPost.length !== 0) ? (youPost / dictPost.length) * 100 : 0 }])
        }).catch((err) => { });
    });

    return (
        <List className={classes.root}>
            {info.map(i =>
                <ListItem>
                    <ListItemAvatar>
                        <CircularProgress variant="static" value={i.frac} color="secondary" />
                    </ListItemAvatar>
                    <ListItemText primary={i.num.toString()} secondary={i.title} />
                </ListItem>
            )}
        </List>
    );
}
