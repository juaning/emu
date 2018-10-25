import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import CustomInput from '../../../components/CustomInput/CustomInput';

import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

class CourseView extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    courseIndex: PropTypes.number.isRequired,
  }

  render() {
    const { classes, courseIndex } = this.props;
    const title = `courseTitle-${courseIndex}`;
    const intitution = `courseInstitution-${courseIndex}`;
    const year = `courseDate-${courseIndex}`;
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
                onChange: event =>
                  this.validateField(event, title, title),
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
                onChange: event =>
                  this.validateField(event, intitution, intitution),
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
            {/* TODO: add classes to match padding */}
            <Datetime
              id={year}
              timeFormat={false}
              dateFormat="YYYY"
              inputProps={{
                name: year,
                id: year,
              }}
              onChange={momentObj =>
                  this.onDOBChange(momentObj, year, year)}
              closeOnSelect
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(regularFormsStyle)(CourseView);