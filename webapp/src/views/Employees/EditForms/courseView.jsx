import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import CustomInput from '../../../components/CustomInput/CustomInput';

import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

class CourseView extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    courseIndex: PropTypes.number.isRequired,
    courseDataChanged: PropTypes.func.isRequired,
    courseDateChanged: PropTypes.func.isRequired,
  }

  state = {
    courseInstitution: (this.props.courseData && this.props.courseData.courseInstitution) || '',
    courseTitle: (this.props.courseData && this.props.courseData.courseTitle) || '',
    year: (this.props.courseData && this.props.courseData.year) || '',
  }

  dataChanged = (event, field) => {
    this.setState({
      [field]: event.target.value,
    });
  }

  dateChanged = (date) => {
    if (typeof date === 'string') return;
    const { courseDateChanged, courseIndex} = this.props;
    let { year } = this.state;
    year = date.format('YYYY');
    this.setState({ year });
    courseDateChanged(date, courseIndex);
  }

  render() {
    const { classes, courseIndex } = this.props;
    const { courseInstitution, courseTitle, year } = this.state;
    const title = `courseTitle-${courseIndex}`;
    const intitution = `courseInstitution-${courseIndex}`;
    const yearId = `courseDate-${courseIndex}`;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Titulo
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={10}>
            <CustomInput
              id={title}
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: title,
                id: title,
                required: true,
                value: courseTitle,
                onChange: event => this.dataChanged(event, 'courseTitle'),
                onBlur: event =>
                  this.props.courseDataChanged(event, courseIndex, 'courseTitle'),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Institución
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={10}>
            <CustomInput
              id={intitution}
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                name: intitution,
                id: intitution,
                required: true,
                value: courseInstitution,
                onChange: event => this.dataChanged(event, 'courseInstitution'),
                onBlur: event =>
                  this.props.courseDataChanged(event, courseIndex, 'courseInstitution'),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Año de Finalización
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={10}>
            <FormControl fullWidth className={classes.formControlCustomInput}>
              <Datetime
                id={yearId}
                timeFormat={false}
                dateFormat="YYYY"
                inputProps={{
                  name: yearId,
                  id: yearId,
                }}
                value={year}
                onChange={momentObj => this.dateChanged(momentObj)}
                closeOnSelect
              />
            </FormControl>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(regularFormsStyle)(CourseView);