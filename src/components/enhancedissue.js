import React from 'react';
import MaterialTable from 'material-table';
import DateFnsUtils from "@date-io/date-fns"; 
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import axios from 'axios';
import {Auth} from '../App';
import { withStyles } from '@material-ui/core/styles';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme => ({
    paper: {
      marginTop: theme.spacing(8),
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

class EnhancedIssue extends React.Component {
    tableRef = React.createRef();
    constructor(props) {
      super(props);
      this.state = {
        columns: [
          {title: 'Title', field: 'title'},
          {title: 'Description', field: 'description'}, 
          {title: 'Course', field: 'course'},
          {title: 'Status', field: 'status', editComponent: props => {
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
                    )
              } else {
              return (<p>{props.value}</p>)
              }
              
          }}, 
          {title: 'Date Due', field: 'dateDue', 
           render: props => {console.log(props); return (
           <MuiPickersUtilsProvider utils={DateFnsUtils}>
           <KeyboardDatePicker
               disableToolbar
               variant="inline"
               format="MM/dd/yyyy"
               margin="normal"
               id="date-picker-inline"
               value={props.dateDue}
               onChange={date => props.onChange(date)}
               KeyboardButtonProps={{
                   'aria-label': 'change date',
                   'disabled': true
               }}
           />
           </MuiPickersUtilsProvider>)},
           editComponent: props => {console.log(props); return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                value={props.dateDue}
                onChange={date => props.onChange(date)}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
            </MuiPickersUtilsProvider>)}}
        ],
        data: [{id: '632783162', title: '说的都是对的', description: '🐑说的都是对的', course: 'ecse 321', status: 'issued', dateDue: new Date('1999-05-26')}]
      }
    }
  
    render() {
        const { classes } = this.props;
      return (
        <Container>
            <CssBaseline />
            <div className={classes.paper}>
        <MaterialTable
            iconProps="https://fonts.googleapis.com/icon?family=Material+Icons"
          title="作业代写"
          tableRef={this.tableRef}
          columns={this.state.columns}
          data={async query => new Promise(async (resolve, reject) => {
            await axios.get('http://localhost:5000/campus/', { headers: { Authorization: 'Bearer ' +  Auth.token } })
            .then(response => {
              response.data.map((e) => {e.date = new Date(e.dateDue.toString())});
              let retdata = [];
              if (!query.search || query.search.length < 1) {
                retdata = response.data.slice(Math.min(query.page       * query.pageSize, response.data.length), 
                Math.min((query.page + 1) * query.pageSize, response.data.length));
              } else {
                let nndatas = []
                for (const entry of response.data) {
                    if (entry.title.includes(query.search)) {
                        nndatas.push(entry)
                    }
                }
                retdata = nndatas.slice(Math.min(query.page       * query.pageSize, response.data.length), 
                Math.min((query.page + 1) * query.pageSize, response.data.length))
                
              }
              resolve({
                    data: retdata, 
                    page: query.page, 
                    totalCount: response.data.length
              })
            })
            .catch(function (error) {
              console.log(error);
            })
          })}
          editable={{
            onRowAdd: newData =>
              new Promise(async (resolve, reject) => {
                newData.status = 'issued';
                await axios({method: 'post', url: 'http://localhost:5000/campus/issue', 
                    data: newData, headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  Auth.token }
                }).catch((err) => {});
                this.tableRef.current && this.tableRef.current.onQueryChange()
                resolve()
              }),
            onRowUpdate: (newData, oldData) => 
              new Promise(async (resolve, reject) => {
                await axios({method: 'put', url: 'http://localhost:5000/campus/issue', 
                     data: {'id': oldData._id, 'newData': newData}, 
                     headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  Auth.token }
                });
                this.tableRef.current && this.tableRef.current.onQueryChange()
                resolve()
              }),
            onRowDelete: oldData =>
              new Promise(async (resolve, reject) => {
                await axios.delete('http://localhost:5000/campus/issue', {
                    headers: {
                        Authorization: 'Bearer ' + Auth.token
                    },
                    data: {
                        id: oldData._id
                    }
                }).then(response => { console.log(response.data)});
                this.tableRef.current && this.tableRef.current.onQueryChange()
                resolve()
              }),
          }}
          options={{
            search: true
          }}
          actions={[
            {
              icon: 'logout',
              tooltip: 'Logout',
              isFreeAction: true,
              onClick: () => Auth.signout(() => window.location.reload()),
            }
          ]}
        />
        </div>
        </Container>
      )
    }
  }

  export default withStyles(styles)(EnhancedIssue);