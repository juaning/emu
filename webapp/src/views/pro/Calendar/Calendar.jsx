import React from 'react';
import PropTypes from 'prop-types';

// react component used to create a calendar with events on it
import BigCalendar from 'react-big-calendar';
// dependency plugin for react-big-calendar
import moment from 'moment';
// react component used to create alerts
import SweetAlert from 'react-bootstrap-sweetalert';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import Heading from '../../../components/Heading/Heading';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';

import buttonStyle from '../../../assets/jss/material-dashboard-pro-react/components/buttonStyle';

import { events } from '../../../variables/general';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events,
      alert: null,
    };
    this.hideAlert = this.hideAlert.bind(this);
  }
  selectedEvent(event) {
    // eslint-disable-next-line
    alert(event.title, this.state.alert);
  }
  addNewEventAlert(slotInfo) {
    this.setState({
      alert: (
        <SweetAlert
          input
          showCancel
          style={{ display: 'block', marginTop: '-100px' }}
          title="Input something"
          onConfirm={e => this.addNewEvent(e, slotInfo)}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            `${this.props.classes.button} ${this.props.classes.success}`
          }
          cancelBtnCssClass={
            `${this.props.classes.button} ${this.props.classes.danger}`
          }
        />
      ),
    });
  }
  addNewEvent(e, slotInfo) {
    const newEvents = this.state.events;
    newEvents.push({
      title: e,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    this.setState({
      alert: null,
      events: newEvents,
    });
  }
  hideAlert() {
    this.setState({
      alert: null,
    });
  }
  eventColors(event) {
    let backgroundColor = 'event-';
    const alert = this.state.alert || true;
    backgroundColor += (event.color && alert) ? event.color : 'default';
    return {
      className: backgroundColor,
    };
  }
  render() {
    return (
      <div>
        <Heading
          textAlign="center"
          title="React Big Calendar"
          category={
            <span>
              A beautiful react component made by{' '}
              <a
                href="https://github.com/intljusticemission"
                target="_blank"
                rel="noopener noreferrer"
              >
                International Justice Mission
              </a>. Please checkout their{' '}
              <a
                href="https://github.com/intljusticemission/react-big-calendar"
                target="_blank"
                rel="noopener noreferrer"
              >
                full documentation.
              </a>
            </span>
          }
        />
        {this.state.alert}
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardBody calendar>
                <BigCalendar
                  selectable
                  events={this.state.events}
                  defaultView="month"
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  defaultDate={new Date()}
                  onSelectEvent={event => this.selectedEvent(event)}
                  onSelectSlot={slotInfo => this.addNewEventAlert(slotInfo)}
                  eventPropGetter={this.eventColors}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Calendar.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
    success: PropTypes.string,
    danger: PropTypes.string,
  }).isRequired,
};

export default withStyles(buttonStyle)(Calendar);
