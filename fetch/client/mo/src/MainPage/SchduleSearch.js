import React, { useState,useEffect } from 'react';
import { MainNab } from './MainPage';
import Calendar from 'react-calendar';
import './SchduleSearch.css';
import 'react-calendar/dist/Calendar.css'; // css import
import { Modal } from 'antd'; // 모달과 버튼을 Ant Design으로 사용
import { useTable } from 'react-table';
import { useSelector } from "react-redux"; // import 해주세요.

function ScheduleSearch() {
    const [value, setValue] = useState(new Date()); // 현재 날짜로 초기화
    const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 저장
    const UserIDtext = useSelector((state) => state.UserID);
    const [userNames, setUserNames] = useState([]);
  


    useEffect(() => {
      fetch('http://localhost:10001/Searchloding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserfullId: UserIDtext,
          User: '홍길동'
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        setUserNames(data.userNames); // 유저 네임을 상태에 저장
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }, []); // 컴포넌트가 마운트될 때 한 번만 호출
  

    

    const [columns, setColumns] = useState([
      {
          Header: '이름',
          accessor: 'main',
      },
  ]);
    const [matchingScheduleResults, setMatchingScheduleResults] = useState([]);
    // 날짜 변경 핸들러
    const onChange = (date) => {
        setValue(date);
    };





    const onSelect = async (date) => {
      const formattedDate = date.toLocaleDateString();
      setSelectedDate(formattedDate);
      setModalVisible(true);
      const UserfullId = UserIDtext.UserID.ID;
      console.log(UserfullId);
  
      try {
          const response = await fetch('http://localhost:10001/schduleSearch', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  UserFullName: '홍길동',
                  UserfullId: UserfullId,
                  finishTime: formattedDate,
                  isRunning: true,
              }),
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          console.log('서버 응답:', data);
  
          // data.matchingScheduleResults의 모든 내용을 출력
          console.log('일치하는 스케줄 결과:', data.matchingScheduleResults);
  
          if (data.matchingScheduleResults && Array.isArray(data.matchingScheduleResults)) {
              // MemberName 값만 따로 출력
              const memberNames = data.matchingScheduleResults.map(result => result.MemberName);
              console.log('MemberName 값:', memberNames);
  
              setMatchingScheduleResults(data.matchingScheduleResults);
          } else {
              console.log('일치하는 스케줄 결과가 없습니다.');
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
  };
  
  

  useEffect(() => {
      if (matchingScheduleResults.length > 0) {
          const newColumns = [
              {
                  Header: '이름',
                  accessor: 'main',
              },
          ];

          // matchingScheduleResults의 각 결과에 대해 동적으로 컬럼 추가
          matchingScheduleResults.forEach((result, index) => {
              newColumns.push({
                Header: result.MemberName, // MemberName을 Header로 사용
                  accessor: `col${index + 1}`, // accessor는 데이터의 키에 맞춰 설정
              });
          });

          setColumns(newColumns);
      }
  }, [matchingScheduleResults]);

    // 모달 확인 버튼 핸들러
    const handleModalOk = () => {
        setModalVisible(false); // 모달 닫기
    };

    // 모달 취소 버튼 핸들러
    const handleModalCancel = () => {
        setModalVisible(false); // 모달 닫기
    };
    const data = React.useMemo(() => {
      // 기본 데이터 배열을 초기화
      const newData = []; // newData 배열 초기화

      for (let i = 0; i < 5; i++) {
          const newEntry = {
              main: 
                  i === 0 ? '근무 날짜' : 
                  i === 1 ? '근무 시작 시간' : 
                  i === 2 ? '근무 진행 상황' : 
                  i === 3 ? '근무 종료 시간' : 
                  '근무한 시간', // 각 행에 맞는 텍스트 설정
          };
      
          // getValue 함수를 정의합니다.
          const getValue = (index, property) => {
              return matchingScheduleResults[index]?.[property];
          };
      
          for (let j = 1; j <= matchingScheduleResults.length; j++) {
              if (j <= matchingScheduleResults.length) {
                  // i에 따라 속성을 다르게 설정
                  if (i === 0) { // i가 0일 때
                      newEntry[`col${j}`] = getValue(j - 1, 'today'); // today 속성 추가
                  } else if (i === 1) { // i가 1일 때
                      newEntry[`col${j}`] = getValue(j - 1, 'StartTime'); // StartTime 속성 추가
                  } else if (i === 2) { // i가 2일 때
                      newEntry[`col${j}`] = getValue(j - 1, 'runningState'); // runningState 속성 추가
                  } else if (i === 3) { // i가 3일 때
                      newEntry[`col${j}`] = getValue(j - 1, 'finishTime'); // finishTime 속성 추가
                  } else if (i === 4) { // i가 4일 때
                      newEntry[`col${j}`] = getValue(j - 1, 'TotalTime'); // 근무한 시간 속성 추가
                  }
              }
          }
      
          newData.push(newEntry); // newEntry를 newData에 추가
      }  
      return newData;
  }, [matchingScheduleResults]);
  
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    const [selectedOption, setSelectedOption] = useState('');
    const [showNumbers, setShowNumbers] = useState(false);

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        setShowNumbers(value !== ''); // 선택된 값이 있을 때만 숫자 표시
    };


    const handleSearch = () => {
      if (!selectedOption) {
        alert('옵션을 선택하세요.');
        return;
      }
  
      fetch('http://localhost:10001/scheduleMainSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedUser: selectedOption // 선택한 유저 네임을 전송
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('검색 결과:', data); // 검색 결과를 처리
        // 추가적인 결과 처리 로직을 여기에 작성
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };

    return (
        <div className='Mainclass'>
          <div className='main-nav-wrapper'>
                <MainNab />
            </div>

            

            <div style={{
        border: '1px solid black',
        width: '200px',
        borderCollapse: 'collapse',
        position: 'absolute',
        top: '300px', // 원하는 위치
      }}>
        <select className='selectbox' onChange={handleSelectChange} value={selectedOption}>
          <option value="">선택하세요</option>
          {userNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
          검색
        </button>
      </div>

            <table {...getTableProps()} style={{
                border: '1px solid black',
                width: '40%',
                borderCollapse: 'collapse',
                position: 'absolute',
                top: '500px', // 원하는 위치
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
                <div className='Calendar' style={{ padding: '20px', position: 'absolute' }}>
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
                     {matchingScheduleResults.length >= 1 ? (
                       <p>선택된 날짜: {selectedDate}</p> // 선택된 날짜 표시
                       ) : (  <p>근무 기록이 없습니다.</p> // 결과가 없을 경우 메시지 표시
                       )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ScheduleSearch;
