import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating beatiful tags on an input
import TagsInput from 'react-tagsinput';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// core components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';

import CourseView from './courseView';

import regularFormsStyle from '../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

import {
  // logError,
  generateMenuItemList,
} from '../../resources/helpers';
import { educationLevelConstant } from '../../resources/constants';

class EducationForm extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }
  state = {
    courseCount: 0,
    educationEntity: {
      languages: ['español'],
    },
  }
  generateCourses() {
    const { courseCount } = this.state;
    const courseFields = [];
    for (let i = 0; i < courseCount; i += 1) {
      courseFields.push(<CourseView validateField={this.validateField} courseIndex={i} />);
    }
    return courseFields;
  }
  generateCourses = this.generateCourses.bind(this)
  validateField(event, type) {
    const { value } = event.target;
    const { educationEntity } = this.state;
    educationEntity[type] = value;
    this.setState({ educationEntity });
  }
  validateField = this.validateField.bind(this)
  handleTags(tags) {
    this.validateField({ target: { value: tags } }, 'languages');
  }
  handleTags = this.handleTags.bind(this)
  addCourse() {
    let { courseCount } = this.state;
    courseCount += 1;
    this.setState({ courseCount });
  }
  addCourse = this.addCourse.bind(this)
  render() {
    const { classes } = this.props;
    const educationalLevelOptions = generateMenuItemList(educationLevelConstant, classes);
    const coursesFields = this.generateCourses();
    const addCourseBtnStyles = {
      float: 'right',
      'margin-top': '39px',
    };
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              {/* <form onSubmit={this.submitHandler}> */}
              <div>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nivel de educación
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={this.state.educationEntity.educationalLevel || ''}
                      inputProps={{
                        name: 'educationalLevel',
                        id: 'educationalLevel',
                        onChange: event => this.validateField(event, 'educationalLevel'),
                      }}
                      autoWidth
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Nivel de educación
                      </MenuItem>
                      {educationalLevelOptions}
                    </Select>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <Button
                      color="rose"
                      onClick={this.addCourse}
                      style={addCourseBtnStyles}
                    >
                      Agregar curso
                    </Button>
                  </GridItem>
                </GridContainer>
                {coursesFields}
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Idiomas
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <TagsInput
                      value={this.state.educationEntity.languages}
                      onChange={this.handleTags}
                      tagProps={{
                        className: 'react-tagsinput-tag info',
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <GridItem xs={12} sm={2} className="right">
                    <Button
                      color="rose"
                      onClick={this.saveClick}
                      className={classes.registerButton}
                    >
                      Guardar
                    </Button>
                  </GridItem>
                </GridContainer>
              </div>
              {/* </form> */}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(EducationForm);
