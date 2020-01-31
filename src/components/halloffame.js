import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { Auth } from "../App";
import { pink } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    pinkk: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
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

export default function HallOfFame() {
    const classes = useStyles();
    const [hof, setHof] = useState([]);
    useEffect(() => {
        // Update the document title using the browser API
        axios.get("http://localhost:5000/task/", { headers: { Authorization: "Bearer " + Auth.token } }).then((response) => {

            let dictExec = groupbyCount(response.data.filter(o => o.executor && o.isFinished).map(o => { return o.executor; }));
            let dictUser = (response.data.reduce((acc, it) => {
                acc[it.username] = acc[it.username] + 1 || 1;
                return acc;
            }, {}));
            let hofr = [];
            for (var i = 0; i < Math.min(3, dictExec.length); i++) {
                hofr.push({ username: dictExec[i].username, finish: dictExec[i].count, post: dictUser[dictExec[i].username] })
            }
            setHof(hofr);

        }).catch((err) => { });

    });
    return (
        <List className={classes.root}>
            {hof.map(h => {
                return (
                    <div>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar className={classes.pinkk}>{h.username[0].toUpperCase()}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={h.username}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {h.finish + " Finished Services"}
                                        </Typography>
                                        {" — " + h.post + " Posts"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                )
            })}
        </List>
    );
}
