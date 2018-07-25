import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";

import Chartist from 'chartist';
import ChartistGraph from "react-chartist";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from '@material-ui/core/Button';

import AccessTime from "@material-ui/icons/AccessTime";
import ArrowUpward from "@material-ui/icons/ArrowUpward";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from 'reducers/actions'
import dateFormat from 'dateformat'

const mapStateToProps = (state, ownProps) => ({
  dailyActivity: getDailyActivity(state, ownProps),
  activeDevice: state.analytics.displayingAnalytics,
  analyticsDevices: state.analytics.analyticsDeviceList
  // deviceDetails: state.devices
})

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

function TableList(props) {
  const { classes } = props;

  const tableData = props.analyticsDevices.map(deviceID => {
    return ['name', deviceID, '10', '11am', <Button onClick={() => props.selectDeviceToDisplay(deviceID)}> View </Button>]
  })

  return (
    <Grid container>
      {displayChart(props.dailyActivity, classes, props)}
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>All Devices</h4>
            <p className={classes.cardCategoryWhite}>
              All Devices Reporting Analytics
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "DeviceID", "Data Points", "Most Active Hour", "View"]}
              tableData={tableData}
            />
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
}

const displayChart = (dailyActivity, classes, props) => (
  <Card chart>
    <CardHeader color="success">
      <ChartistGraph
        className="ct-chart"
        data={dailyActivitySchema(dailyActivity).data}
        type="Line"
        options={dailyActivitySchema().options}
        listener={dailyActivitySchema().animation}
      />
    </CardHeader>
    <CardBody>
      <h4 className={classes.cardTitle}>{props.activeDevice}</h4>
    </CardBody>
    <CardFooter chart>
      <div className={classes.stats}>
        <AccessTime /> updated 4 minutes ago
      </div>
    </CardFooter>
  </Card>
)


var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TableList)))


const getAnalyticsSeries = (state, ownProps, key) => {

  if ("analytics" in state) {
    if (state.analytics.displayingAnalytics in state.analytics) {
      return Array.from(Object.keys(state.analytics[state.analytics.displayingAnalytics]), x => state.analytics[state.analytics.displayingAnalytics][x][key]);
    }
  }

  return []
}

const getDailyActivity = (state, ownProps) => {

  var allTimes = getAnalyticsSeries(state, ownProps, 'timeStamp');

  var hourCounters = new Array(24).fill(0);

  for (var i in allTimes) {
    var keydate = new Date(allTimes[i])
    var key = keydate.getUTCHours() ;
    hourCounters[key] += 1;

  }

  var maxCounter = Math.max(...hourCounters);

  for (var i = 0; i < hourCounters.length; i++) {
    hourCounters[i] /= (maxCounter / 100);
  }  

  return hourCounters
}


// ##############################
// // // Completed Tasks
// #############################

var delays = 80,
  durations = 500;

const dailyActivitySchema = (dailyActivity = []) => ({
  data: {
    labels: ["", "", "2am", "", "", "5am", "", "", "8am", "", "", "11am", "", "", "2pm", "", "", "5pm", "", "", "8pm", "", "", "11pm"],
    series: [dailyActivity]
  },
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    high: 105, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  animation: {
    draw: function(data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
});
