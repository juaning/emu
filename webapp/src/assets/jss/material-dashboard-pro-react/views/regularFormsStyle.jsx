// ##############################
// // // RegularForms view styles
// #############################

import { cardTitle } from '../../material-dashboard-pro-react';
import customCheckboxRadioSwitch from '../../material-dashboard-pro-react/customCheckboxRadioSwitch';
import { red } from '@material-ui/core/colors';

const regularFormsStyle = {
  ...customCheckboxRadioSwitch,
  cardIconTitle: {
    ...cardTitle,
    marginTop: '15px',
    marginBottom: '0px',
  },
  staticFormGroup: {
    marginLeft: '0',
    marginRight: '0',
    paddingBottom: '10px',
    margin: '8px 0 0 0',
    position: 'relative',
    '&:before,&:after': {
      display: 'table',
      content: '" "',
    },
    '&:after': {
      clear: 'both',
    },
  },
  staticFormControl: {
    marginBottom: '0',
    paddingTop: '8px',
    paddingBottom: '8px',
    minHeight: '34px',
  },
  formControlCustomInput: {
    margin: '0 0 17px 0',
    paddingTop: '27px',
    position: 'relative',
    '& svg,& .fab,& .far,& .fal,& .fas': {
      color: '#495057',
    }
  },
  headerSeparator: {
    borderRightColor: 'gray',
    borderRightWidth: '2px',
    borderRightStyle: 'solid',
  },
};

export default regularFormsStyle;
