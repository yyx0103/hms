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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
        width: "100%",
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
                    title: "Title",
                    field: "title",
                    editable: Auth.isServer ? "never" : "onAdd"
                },
                {
                    title: "Description",
                    field: "description",
                    editable: Auth.isServer ? "never" : "onAdd"
                },
                {
                    title: "Course",
                    field: "course",
                    editable: Auth.isServer ? "never" : "onAdd"
                },
                {
                    title: "Status",
                    field: "status",
                    editComponent: props => {
                        if (Auth.isServer) {
                            return (
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={props.value}
                                    onChange={s => props.onChange(s.target.value)}
                                >
                                    <MenuItem value={"issued"}>issued</MenuItem>
                                    <MenuItem value={"accpted"}>accpted</MenuItem>
                                    <MenuItem value={"finished"}>finished</MenuItem>
                                    <MenuItem value={"canceled"}>canceled</MenuItem>
                                </Select>
                            );
                        } else {
                            return <p>{props.value}</p>;
                        }
                    }
                },
                {
                    title: "Date Due",
                    field: "dateDue",
                    render: props => {
                        return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
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
                            </MuiPickersUtilsProvider>
                        );
                    },
                    editComponent: props => {
                        return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    disabled={Auth.isServer}
                                    id="date-picker-inline"
                                    value={props.dateDue}
                                    onChange={date => props.onChange(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                        disabled: Auth.isServer,
                                        onChange: date => props.onChange(date)
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        );
                    }
                }
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
            })
            .catch(err => { });
        console.log(this.state.family)
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
                            title={this.state.family}
                            tableRef={this.tableRef}
                            columns={this.state.columns}
                            data={async query =>
                                new Promise(async (resolve, reject) => {
                                    await axios
                                        .get("http://localhost:5000/campus/", {
                                            headers: { Authorization: "Bearer " + Auth.token }
                                        })
                                        .then(response => {
                                            response.data.map(e => {
                                                e.date = new Date(e.dateDue.toString());
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
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                })
                            }
                            editable={{
                                onRowAdd: Auth.isServer
                                    ? null
                                    : newData =>
                                        new Promise(async (resolve, reject) => {
                                            newData.status = "issued";
                                            await axios({
                                                method: "post",
                                                url: "http://localhost:5000/campus/issue",
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
                                            url: "http://localhost:5000/campus/issue",
                                            data: { id: oldData._id, newData: newData },
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: "Bearer " + Auth.token
                                            }
                                        });
                                        this.tableRef.current &&
                                            this.tableRef.current.onQueryChange();
                                        resolve();
                                    }),
                                onRowDelete: oldData =>
                                    new Promise(async (resolve, reject) => {
                                        await axios
                                            .delete("http://localhost:5000/campus/issue", {
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
                                search: true
                            }}
                            actions={[
                                {
                                    icon: ExitToAppIcon,
                                    tooltip: "Logout",
                                    isFreeAction: true,
                                    onClick: () => Auth.signout(() => window.location.reload())
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
