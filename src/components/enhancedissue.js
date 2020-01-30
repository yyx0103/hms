import React from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import DateFnsUtils from "@date-io/date-fns";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Auth } from "../App";
import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/yyx0103">
                Yuxin Yang
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    ExitToAppIcon: forwardRef((props, ref) => (
        <ExitToAppIcon {...props} ref={ref} />
    ))
};

const styles = theme => ({
    darkColor: {
        color: theme.palette.primary.dark
    },
    paper: {
        marginTop: theme.spacing(8),
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
});

class EnhancedIssue extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            family: "Yang Yuxin",
            columns: [
                {
                    title: "Posted By",
                    field: "username",
                    editable: "never"
                },
                {
                    title: "Title",
                    field: "title",
                },
                {
                    title: "Description",
                    field: "description",
                },
                {
                    title: "Exec",
                    field: "executor",
                    editable: "never"
                },

                {
                    title: "Date Due",
                    field: "dateDue",
                    render: props => {
                        return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="dialog"
                                        format="MM/dd/yyyy"
                                        margin="none"
                                        fullWidth={false}
                                        id="date-picker-inline"
                                        value={props.dateDue}
                                        disabled={true}
                                        onChange={date => props.onChange(date)}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                            disabled: true,
                                            onChange: date => props.onChange(date)
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        );
                    },
                    editComponent: props => {
                        return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="dialog"
                                        format="MM/dd/yyyy"
                                        margin="none"
                                        fullWidth={false}
                                        disabled={props.isFinished || props.executor}
                                        id="date-picker-inline"
                                        value={props.dateDue}
                                        onChange={date => props.onChange(date)}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                            disabled: props.isFinished || props.executor,
                                            onChange: date => props.onChange(date)
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        );
                    }
                }, {
                    title: "Status",
                    field: "isFinished",
                    editable: "never"
                },

            ],
            data: []
        };
    }

    async componentDidMount() {
        await axios
            .get("http://localhost:5000/user/", {
                headers: { Authorization: "Bearer " + Auth.token }
            })
            .then(user => {
                this.setState({ family: (user.data.family) ? (user.data.family) : this.state.family });
                this.setState({ member: user.data.member });
            })
            .catch(err => { });
    }

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={classes.darkColor}>
                <Container>
                    <CssBaseline />
                    <div className={classes.form}>
                        <MaterialTable
                            icons={tableIcons}
                            title={Auth.username}
                            tableRef={this.tableRef}
                            columns={this.state.columns}
                            data={async query =>
                                new Promise(async (resolve, reject) => {
                                    await axios
                                        .get("http://localhost:5000/task/", {
                                            headers: { Authorization: "Bearer " + Auth.token }
                                        })
                                        .then(response => {
                                            response.data.map(e => {
                                                e.date = new Date(e.dateDue.toString());
                                                e.isFinished = (e.isFinished) ? "Finished" : "Issued";
                                                if (e.executor) {
                                                    e.executor = e.executor.substr(0, e.executor.indexOf("@"));
                                                }
                                            });
                                            let retdata = [];
                                            if (!query.search || query.search.length < 1) {
                                                retdata = response.data.slice(
                                                    Math.min(
                                                        query.page * query.pageSize,
                                                        response.data.length
                                                    ),
                                                    Math.min(
                                                        (query.page + 1) * query.pageSize,
                                                        response.data.length
                                                    )
                                                );
                                            } else {
                                                let nndatas = [];
                                                for (const entry of response.data) {
                                                    if (entry.title.includes(query.search)) {
                                                        nndatas.push(entry);
                                                    }
                                                }
                                                retdata = nndatas.slice(
                                                    Math.min(
                                                        query.page * query.pageSize,
                                                        response.data.length
                                                    ),
                                                    Math.min(
                                                        (query.page + 1) * query.pageSize,
                                                        response.data.length
                                                    )
                                                );
                                            }
                                            resolve({
                                                data: retdata,
                                                page: query.page,
                                                totalCount: response.data.length
                                            });
                                        })
                                        .catch(function (error) { });
                                })
                            }
                            editable={{
                                onRowAdd: newData =>
                                    new Promise(async (resolve, reject) => {
                                        await axios({
                                            method: "post",
                                            url: "http://localhost:5000/task/issue",
                                            data: newData,
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: "Bearer " + Auth.token
                                            }
                                        }).catch(err => { });
                                        this.tableRef.current &&
                                            this.tableRef.current.onQueryChange();
                                        resolve();
                                    }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise(async (resolve, reject) => {
                                        await axios({
                                            method: "put",
                                            url: "http://localhost:5000/task/issue",
                                            data: { id: oldData._id, newData: newData },
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: "Bearer " + Auth.token
                                            }
                                        }).catch(err => {

                                        });
                                        this.tableRef.current &&
                                            this.tableRef.current.onQueryChange();
                                        resolve();
                                    }),
                                onRowDelete: oldData =>
                                    new Promise(async (resolve, reject) => {
                                        await axios
                                            .delete("http://localhost:5000/task/issue", {
                                                headers: {
                                                    Authorization: "Bearer " + Auth.token
                                                },
                                                data: {
                                                    id: oldData._id
                                                }
                                            })
                                            .then(response => { });
                                        this.tableRef.current &&
                                            this.tableRef.current.onQueryChange();
                                        resolve();
                                    })
                            }}
                            options={{
                                exportButton: true,
                                search: true,
                                selection: true,
                                selectionProps: rowData => ({
                                    disabled: rowData.isFinished === "Finished" || (!rowData.executor && rowData.executor != "" && Auth.username.includes(rowData.executor)),
                                    color: 'secondary'
                                }),
                                headerStyle: {
                                    textAlign: 'center',
                                },
                                rowStyle: {
                                    textAlign: 'center',
                                }
                            }}
                            actions={[
                                {
                                    icon: ExitToAppIcon,
                                    tooltip: "Logout",
                                    isFreeAction: true,
                                    onClick: () => Auth.signout(() => window.location.reload())
                                },
                                {
                                    tooltip: 'Remove All Selected Tasks',
                                    icon: DeleteIcon,
                                    onClick: (evt, datax) => {
                                        datax.map(async data => {
                                            await axios
                                                .delete("http://localhost:5000/task/issue", {
                                                    headers: {
                                                        Authorization: "Bearer " + Auth.token
                                                    },
                                                    data: {
                                                        id: data._id
                                                    }
                                                })
                                                .then(response => { });
                                            this.tableRef.current && this.tableRef.current.onQueryChange();
                                        });

                                    }
                                },
                                {
                                    tooltip: 'Assign Yourself to These Tasks',
                                    icon: ShoppingCartIcon,
                                    onClick: async (evt, datax) => {
                                        await datax.map(async data => {
                                            await axios({
                                                method: "put",
                                                url: "http://localhost:5000/task/issue",
                                                data: {
                                                    id: data._id, newData: {
                                                        executor: Auth.username
                                                    }
                                                },
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    Authorization: "Bearer " + Auth.token
                                                }
                                            }).then(() => {

                                            });
                                            this.tableRef.current && this.tableRef.current.onQueryChange();
                                        });

                                    }
                                },
                                {
                                    tooltip: 'Mark as Finished',
                                    icon: AssignmentTurnedInIcon,
                                    onClick: (evt, datax) => {
                                        datax.map(async data => {
                                            await axios({
                                                method: "put",
                                                url: "http://localhost:5000/task/issue",
                                                data: {
                                                    id: data._id, newData: {
                                                        isFinished: true
                                                    }
                                                },
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    Authorization: "Bearer " + Auth.token
                                                }
                                            });
                                            this.tableRef.current && this.tableRef.current.onQueryChange();
                                        });
                                    }
                                }
                            ]}
                        />
                    </div>
                </Container>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles)(EnhancedIssue);
