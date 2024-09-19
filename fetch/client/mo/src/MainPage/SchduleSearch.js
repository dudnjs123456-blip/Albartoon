import React, { useState,useEffect ,useRef} from 'react';
import { MainNab } from './MainPage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import
import { Modal, Button } from 'antd'; // 모달과 버튼을 Ant Design으로 사용
import { useTable } from 'react-table';
function ScheduleSearch(){
    const [value, setValue] = useState(new Date()); // 현재 날짜로 초기화
    const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 저장

    // 날짜 변경 핸들러
    const onChange = (date) => {
        setValue(date);
    };

    // 날짜 선택 핸들러
    const onSelect = (date) => {
        setSelectedDate(date.toLocaleDateString()); // 선택된 날짜를 포맷
        setModalVisible(true); // 모달 열기
    };

    // 모달 확인 버튼 핸들러
    const handleModalOk = () => {
        setModalVisible(false); // 모달 닫기
    };

    // 모달 취소 버튼 핸들러
    const handleModalCancel = () => {
        setModalVisible(false); // 모달 닫기
    }

    const data = React.useMemo(
        () => [
          { main: 'Row 1', col1: 'Data 1', col2: 'Data 2', col3: 'Data 3' },
          { main: 'Row 2', col1: 'Data 4', col2: 'Data 5', col3: 'Data 6' },
          { main: 'Row 3', col1: 'Data 7', col2: 'Data 8', col3: 'Data 9' },
          { main: 'Row 4', col1: 'Data 10', col2: 'Data 11', col3: 'Data 12' },
          { main: 'Row 5', col1: 'Data 13', col2: 'Data 14', col3: 'Data 15' },
        ],
        []
      );
    
      const columns = React.useMemo(
        () => [
          {
            Header: 'Main',
            accessor: 'main', // accessor is the "key" in the data
          },
          {
            Header: 'Column 1',
            accessor: 'col1',
          },
          {
            Header: 'Column 2',
            accessor: 'col2',
          },
          {
            Header: 'Column 3',
            accessor: 'col3',
          },
        ],
        []
      );
    
      const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
        return(
            <body>
                     <MainNab />
                     <table {...getTableProps()} style={{
    border: '1px solid black',
    width: '40%',
    borderCollapse: 'collapse',
    position: 'absolute',
    top: '200px', // 원하는 위치
  }}>

<thead>
  {headerGroups.map(headerGroup => (
    <tr {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map(column => (
        <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '10px' }}>
          {column.render('Header')}
        </th>
      ))}
    </tr>
  ))}
</thead>
<tbody {...getTableBodyProps()}>
  {rows.map(row => {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map(cell => (
          <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '10px' }}>
            {cell.render('Cell')}
          </td>
        ))}
      </tr>
    );
  })}
</tbody>
</table>
        <div>
        <div className='Calendar' style={{ padding: '20px',position: 'absolute', top: '120px' }}>
            <Calendar
                onChange={onChange}
                value={value}
                onClickDay={onSelect} // 날짜 클릭 시 호출
                style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}
            />
            <Modal
                className='calendarModal'
                title="선택된 날짜"
                visible={modalVisible} // 모달의 가시성 상태
                onOk={handleModalOk} // 확인 버튼 클릭 시
                onCancel={handleModalCancel} // 취소 버튼 클릭 시
            >
                <p>선택된 날짜: {selectedDate}</p> {/* 선택된 날짜 표시 */}
            </Modal>
        </div>
    </div>
      

            </body>
        )

}


export default ScheduleSearch;