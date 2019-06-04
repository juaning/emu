import React from 'react';
import PropTypes from 'prop-types';
// react component plugin for creating beatiful tags on an input
import TagsInput from 'react-tagsinput';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';
import Button from '../../../components/CustomButtons/Button';

import CourseView from './courseView';

import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

// API resources
import API from '../../../resources/api';

import {
  // logError,
  generateMenuItemList, logError,
} from '../../../resources/helpers';
import {
  educationLevelConstant,
  languagesConstant,
} from '../../../resources/constants';

const employeeAPI = new API({ url: '/employee' });
employeeAPI.createEntity({ name: 'education' });

class EducationForm extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    employee: PropTypes.shape({}).isRequired,
  }
  state = {
    courseCount: 0,
    educationEntity: {
      employeeId: this.props.employeeId,
      educationalLevel: this.props.employee.educationalLevel || '',
      languages: this.props.employee.languages || languagesConstant,
      courses: this.props.employee.courses || [],
      id: this.props.employee._id || null,
    },
  }
  generateCourses() {
    const { courseCount, educationEntity } = this.state;
    const { courses } = educationEntity;
    const courseFields = [];
    let cc = courseCount || courses.length;
    for (let i = 0; i < cc; i += 1) {
      courseFields.push(<CourseView
        courseDataChanged={this.courseDataChanged}
        courseDateChanged={this.courseDateChanged}
        courseIndex={i}
        courseData={courses[i]}
      />);
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
  courseDataChanged(event, index, type) {
    const { value } = event.target;
    const { educationEntity } = this.state;
    const { courses } = educationEntity;
    if (courses[index] === undefined) courses[index] = {};
    courses[index][type] = value;
    educationEntity.courses = courses;
    this.setState({ educationEntity });
  }
  courseDataChanged = this.courseDataChanged.bind(this)
  courseDateChanged(momentObj, index) {
    const year = momentObj.format('YYYY');
    const { educationEntity } = this.state;
    const { courses } = educationEntity;
    if (courses[index] === undefined) courses[index] = {};
    courses[index].year = year;
    educationEntity.courses = courses;
    this.setState(educationEntity);
  }
  courseDateChanged = this.courseDateChanged.bind(this)
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
  saveClick() {
    const { educationEntity } = this.state;
    let promise;
    if (educationEntity.id) {
      promise = employeeAPI.endpoints.education.update(educationEntity);
    } else {
      promise = employeeAPI.endpoints.education.create(educationEntity)
    }
    promise
      .then(response => response.json())
      .then(data => {
        const { errors, errmsg } = data;
        if (errors || errmsg) {
          const err = errors ? errors : errmsg;
          logError(err);
          return;
        }
        this.props.updateEmployeeData(educationEntity, 'education');
      })
      .catch(err => logError(err));
  }
  saveClick = this.saveClick.bind(this)
  render() {
    const { classes } = this.props;
    const { educationEntity } = this.state;
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
              <div>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Nivel de educación
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={educationEntity.educationalLevel || ''}
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
                    </FormControl>
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
                    <FormControl fullWidth className={classes.formControlCustomInput}>
                      <TagsInput
                        value={educationEntity.languages}
                        onChange={this.handleTags}
                        tagProps={{
                          className: 'react-tagsinput-tag info',
                          fullWidth: true,
                        }}
                      />
                    </FormControl>
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
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(EducationForm);
