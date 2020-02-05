import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import axios from 'axios';
import { Auth } from '../App';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { pink } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: 240,
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
    pinkk: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
    },
}));



export default function FamilyList() {
    const classes = useStyles();
    const [members, setMembers] = useState([]);
    useEffect(() => {
        // Update the document title using the browser API
        axios.get("/user/", { headers: { Authorization: "Bearer " + Auth.token } }).then((response) => {
            setMembers(response.data.member);
        }).catch((err) => { });
    });
    function renderRow(props) {
        const { index, style } = props;
        return (
            <ListItem style={style} key={index}>

                <ListItemText primary={members[index]} />

            </ListItem>
        );
    }

    renderRow.propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
    };
    return (
        <div className={classes.root}>
            <FixedSizeList height={250} width={360} itemSize={46} itemCount={members.length}>
                {renderRow}
            </FixedSizeList>
        </div>
    );
}
