import { HTMLAttributes } from 'react';

import { ITableProps } from '../';
import { ICellContentProps } from '../Components/CellContent/CellContent';
import { DataType, EditingMode, SortDirection } from '../enums';
import { ChildAttributesItem } from '../types';
import { getData, mergeProps } from './PropsUtils';

describe('PropsUtils', () => {
  it('mergeProps', () => {
    const childElementAttributes: HTMLAttributes<HTMLElement> = {
      className: 'custom',
      onClick: () => {},
      onDoubleClick: () => {},
    };

    const dispatch = () => {};
    const childProps: ICellContentProps = {
      childAttributes: {},
      column: { key: 'column' },
      dispatch,
      editingMode: EditingMode.Cell,
      field: 'column',
      rowData: { column: 1, column2: 2, id: 0 },
      rowKeyField: 'id',
    };

    const childCustomAttributes: ChildAttributesItem<any> = {
      onClick: jest.fn(),
    };
    const props = mergeProps(childElementAttributes, childProps, childCustomAttributes, dispatch);
    const e: any = {name: 'eventName'};
    props.onClick!(e);
    expect(childCustomAttributes.onClick).toHaveBeenCalledTimes(1);
    expect(childCustomAttributes.onClick).toHaveBeenCalledWith(e, {
      baseFunc: childElementAttributes.onClick,
      childElementAttributes,
      childProps,
      dispatch: childProps.dispatch,
    });
  });
});

describe('getData', () => {
  const dataArray = Array(5).fill(undefined).map(
    (_, index) => ({
      column1: `column:1 row:${index}`,
      column2: `column:2 row:${index}`,
      column3: `column:3 row:${index}`,
      column4: `column:4 row:${index}`,
      id: index,
    }),
  );
  const props: ITableProps = {
    data: dataArray,
    columns: [
      { key: 'column1', title: 'Column 1', dataType: DataType.String },
      { key: 'column2', title: 'Column 2', dataType: DataType.String },
      { key: 'column3', title: 'Column 3', dataType: DataType.String },
      { key: 'column4', title: 'Column 4', dataType: DataType.String },
    ],
    rowKeyField: 'id'
  }
  it('get data by search', () => {
    const result = getData({ ...props , search: 'row:3' });
    expect(result).toMatchSnapshot();
  });
  it('get data by filter', () => {
    const result = getData({ ...props , columns: [
      {
        key: 'column1',
        title: 'Column 1',
        dataType: DataType.String,
        filterRowValue: 'column:1 row:2'
      }
    ] });
    expect(result).toMatchSnapshot();
  });

  it('get data by extendedFilter', () => {
    const result = getData({ ...props , extendedFilter: (data) => data.filter(i => i.id === 1) });
    expect(result).toMatchSnapshot();
  });

  it('get sorted data', () => {
    const result = getData({ ...props , columns: [{
      key: 'column1',
      title: 'Column 1',
      dataType: DataType.String,
      sortDirection: SortDirection.Descend
    }]});
    expect(result).toMatchSnapshot();
  });

  it('get paged data', () => {
    const result = getData({ ...props , paging: { enabled: true, pageIndex: 1, pageSize: 2 }});
    expect(result).toMatchSnapshot();
  });

  it('get grouped data', () => {
    const result = getData({ ...props , groups: [{ columnKey: 'column1' }] });
    expect(result).toMatchSnapshot();
  });
});

