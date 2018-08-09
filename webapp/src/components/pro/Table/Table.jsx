import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import shortid from 'shortid';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import tableStyle from '../../assets/jss/material-dashboard-pro-react/components/tableStyle';

function CustomTable({ ...props }) {
  const {
    classes,
    tableHead,
    tableData,
    tableHeaderColor,
    hover,
    colorsColls,
    coloredColls,
    customCellClasses,
    customClassesForCells,
    striped,
    tableShopping,
    customHeadCellClasses,
    customHeadClassesForCells,
  } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor]}>
            <TableRow className={classes.tableRow}>
              {tableHead.map((prop, key) => {
                const cellKey = shortid.generate();
                const tableCellClasses =
                  `${classes.tableHeadCell} ${classes.tableCell} ${cx({
                    [customHeadCellClasses[
                      customHeadClassesForCells.indexOf(key)
                    ]]:
                      customHeadClassesForCells.indexOf(key) !== -1,
                    [classes.tableShoppingHead]: tableShopping,
                    [classes.tableHeadFontSize]: !tableShopping,
                  })}`;
                return (
                  <TableCell className={tableCellClasses} key={cellKey}>
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            const rowKey = shortid.generate();
            let rowColor = '';
            let rowColored = false;
            let cellData = prop;
            if (prop.color !== undefined) {
              rowColor = prop.color;
              rowColored = true;
              cellData = prop.data;
            }
            const tableRowClasses = cx({
              [classes.tableRowHover]: hover,
              [classes[`${rowColor}Row`]]: rowColored,
              [classes.tableStripedRow]: striped && key % 2 === 0,
            });
            if (cellData.total) {
              return (
                <TableRow key={rowKey} hover={hover} className={tableRowClasses}>
                  <TableCell
                    className={classes.tableCell}
                    colSpan={cellData.colspan}
                  />
                  <TableCell
                    className={`${classes.tableCell} ${classes.tableCellTotal}`}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    className={
                      `${classes.tableCell} ${classes.tableCellAmount}`
                    }
                  >
                    {cellData.amount}
                  </TableCell>
                  {tableHead.length - ((cellData.colspan - 0) + 2) > 0 ? (
                    <TableCell
                      className={classes.tableCell}
                      colSpan={tableHead.length - ((cellData.colspan - 0) + 2)}
                    />
                  ) : null}
                </TableRow>
              );
            }
            if (cellData.purchase) {
              return (
                <TableRow key={rowKey} hover={hover} className={tableRowClasses}>
                  <TableCell
                    className={classes.tableCell}
                    colSpan={cellData.colspan}
                  />
                  <TableCell
                    className={`${classes.tableCell} ${classes.right}`}
                    colSpan={cellData.col.colspan}
                  >
                    {cellData.col.text}
                  </TableCell>
                </TableRow>
              );
            }
            return (
              <TableRow
                key={rowKey}
                hover={hover}
                className={`${classes.tableRow} ${tableRowClasses}`}
              >
                {cellData.map((propChild, keyChild) => {
                  const rowKeyChild = shortid.generate();
                  const tableCellClasses =
                    `${classes.tableCell} ${cx({
                      [classes[colorsColls[coloredColls.indexOf(keyChild)]]]:
                        coloredColls.indexOf(keyChild) !== -1,
                      [customCellClasses[customClassesForCells.indexOf(keyChild)]]:
                        customClassesForCells.indexOf(keyChild) !== -1,
                    })}`;
                  return (
                    <TableCell className={tableCellClasses} key={rowKeyChild}>
                      {propChild}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
  hover: false,
  colorsColls: [],
  coloredColls: [],
  striped: false,
  customCellClasses: [],
  customClassesForCells: [],
  customHeadCellClasses: [],
  customHeadClassesForCells: [],
  tableHead: [],
  tableData: [],
  tableShopping: false,
};

CustomTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  // Of(PropTypes.arrayOf(PropTypes.node)) || Of(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.node),
  hover: PropTypes.bool,
  coloredColls: PropTypes.arrayOf(PropTypes.number),
  // Of(["warning","primary","danger","success","info","rose","gray"]) - colorsColls
  colorsColls: PropTypes.arrayOf(PropTypes.string),
  customCellClasses: PropTypes.arrayOf(PropTypes.string),
  customClassesForCells: PropTypes.arrayOf(PropTypes.number),
  customHeadCellClasses: PropTypes.arrayOf(PropTypes.string),
  customHeadClassesForCells: PropTypes.arrayOf(PropTypes.number),
  striped: PropTypes.bool,
  // this will cause some changes in font
  tableShopping: PropTypes.bool,
};

export default withStyles(tableStyle)(CustomTable);
