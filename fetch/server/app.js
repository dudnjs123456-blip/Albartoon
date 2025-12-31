const express = require('express');
const session = require('express-session');
const app = express();
const port = 10001;
const cors = require('cors');
const compression = require("compression");
const cron = require('node-cron');
const moment = require('moment'); // 날짜 및 시간 처리 모듈

// 세션 미들웨어 설정
app.use(session({
  secret: 'dasd21313',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    // 여기에서 쿠키 이름을 설정할 수 있습니다.
    name: 'connect.sid', // 기본값은 'connect.sid'
    maxAge: 1000 * 60 * 60 // 쿠키의 유효 기간 (예: 1시간)
  }
}));


app.use(compression());
app.use(cors({
  origin: 'http://localhost:3000', // 요청을 허용할 출처
  credentials: true // 자격 증명 포함 허용
}));
 
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// sql 연동
const mysql      = require('mysql2');
const dbconfig   = require('./sql.js');
const connection = mysql.createConnection(dbconfig);

// configuration =========================
app.set('port', process.env.PORT || 3001);
app.get('/', (req, res) => {
res.send('Root');
}); 


// OurStore 페이지 라우트
app.get('/OurStore', (req, res) => {
  console.log('들어왔다'); // 콘솔에 메시지 출력
  res.send('OurStore 페이지에 오신 것을 환영합니다!');
});


// 로그인 중복확인  
app.get('/', (req, res) => {  
  res.send('Hello World!');
  console.log(req.ip);
})

app.get('/user',(req,res)=>{    
  res.json(todoList); 
})

const userId = [{
  text : ''
}]
app.post('/user',(req,res)=>{ 
    const { text } =  req.body;
  let uceom = {
  new_tablecol2 : text,
}
  connection.query("select count(*) cnt from new_table where new_tablecol2 =?", text,(error, rows) => {
  if (error) throw error;
  let con = connection.query("select count(*) cnt from new_table where new_tablecol2 =?",text)
  // connection.query("INSERT INTO new_table SET ? ",uceom);

  if(rows[0].cnt==0){
    userId.push({
      text : text 
    })
  }
  // console.log(userId)
  return res.send(rows[0]);
});
})  

// 전체적인 로그인 데이터 관리
const LoginDB= [{
      
}]

function LogDBPost(userId){
return new Promise((resolve)=>{
app.post('/userDB',(req,res) =>{
  const { passwordname , passwordcheck , User_Name , User_Fs_security, User_Back_security,Idtext} = req.body;
  let NewDB = {
    idnew_table : 7,
    new_tablecol : passwordname.password,
    new_tablecol1 : passwordcheck.password,
    new_tablecol2 : Idtext,
    User_Name : User_Name.Name,
    User_ID : 1,
    User_Phone : 1 ,
    User_email : 1,
    User_Security_Number : User_Fs_security.Frontsecurity,
    User_Security_BackNumber : User_Back_security.Backsecurity,
  }
  
  console.log('req.body : ', req.body );

  let cont = connection.query("INSERT IGNORE INTO new_table SET ? ",NewDB,(error, rows) => {
    if (error) throw error;
    // connection.query("INSERT INTO new_table SET ? ",uceom);
    // console.log(cont.values);

    const FinishLoginDB = LoginDB[LoginDB.length-1].NewDB;

    console.log(FinishLoginDB);

    LoginDB.push({
      NewDB
    })
    resolve(NewDB); 
    res.json(NewDB); // JSON 형식으로 응답을 보냅니다.
  })
})
})
} 

app.get("/userDB", async (req,res)=> {
  res.json(LoginDB);
});

async function LoginDBsequence(){
  await LogDBPost()
  console.log(LoginDB);
}

LoginDBsequence()

// 메인 페이지 로그인 서버 

const UserLoginDB= [{
  id : '',
  User_Id : '',
  User_password  : "",
}]

app.get("/userLgoin", (req,res)=> {
  res.json(UserLoginDB);
});

const jwt = require('jsonwebtoken');

/*
app.post('/userLogin', (req, res) => {
  const { User_Id, User_password } = req.body;
  console.log('req.body : ', req.body);

  let LoginCheck = connection.query("select * from new_table where new_tablecol2 = ? and new_tablecol = ?", [User_Id, User_password], (error, rows) => {
    if (error) throw error;

    if (rows[0] === undefined) {
      console.log('아이디를 확인해주세요');
      return res.send({ message: '아이디를 확인해주세요' });
    } else {
      console.log('로그인 완료');

      // JWT 토큰 생성
      const token = jwt.sign({
        User_Id: rows[0].new_tablecol2,
        User_Name: rows[0].User_Name,
        User_StoreName: rows[0].User_StoreName
      }, 'your_secret_key', { expiresIn: '1h' });

      return res.send({
        token: token,
        User_Name: rows[0].User_Name,
        User_StoreName: rows[0].User_StoreName,
        User_Id: rows[0].new_tablecol2
      });
    }
  });
});
*/
app.post('/userLogin', (req, res) => {
  const { User_Id, User_password } = req.body;
  console.log('req.body : ', req.body);

  let LoginCheck = connection.query("select * from new_table where new_tablecol2 = ? and new_tablecol = ?", [User_Id, User_password], (error, rows) => {
    if (error) throw error;

    if (rows[0] === undefined) {
      console.log('아이디를 확인해주세요');
      return res.send({ message: '아이디를 확인해주세요' });
    } else {
      console.log('로그인 완료');

      // 세션에 사용자 정보 저장
      req.session.user = {
        User_Id: rows[0].new_tablecol2,
        User_Name: rows[0].User_Name,
        User_StoreName: rows[0].User_StoreName
      };

      console.log(req.session.user)

           // JWT 토큰 생성
           const token = jwt.sign({
            User_Id: rows[0].new_tablecol2,
            User_Name: rows[0].User_Name,
            User_StoreName: rows[0].User_StoreName
          }, 'your_secret_key', { expiresIn: '1h' });
    
          return res.send({
            token: token,
            User_Name: rows[0].User_Name,
            User_StoreName: rows[0].User_StoreName,
            User_Id: rows[0].new_tablecol2
          });
    }
  });

});

app.post('/LoginCheck', (req, res) => {
  // 클라이언트로부터 세션 정보를 받아옵니다.
  const sessionData = req.body.sessionData; // 클라이언트에서 보낸 세션 데이터

  // 로그아웃 전 세션 정보 출력
  console.log('로그아웃 전 세션 정보: ', req.session);
  console.log('현재 로그인 상태:', req.session.user);
  console.log('세션 ID:', req.sessionID);
  console.log('세션 만료 시간:', req.session.cookie.expires);

  // 클라이언트에서 받은 세션 데이터 출력
  console.log('클라이언트에서 받은 세션 데이터:', sessionData);

  // 로그인 여부 확인
  if (req.session.user) {
    console.log('로그인된 사용자 정보: ', req.session.user);
  } else {
    console.log('로그인된 사용자가 없습니다.');
  }

  // 클라이언트에게 세션 정보를 응답으로 보냅니다.
  res.json({
    session: {
      user: req.session.user,
      sessionID: req.sessionID,
      expires: req.session.cookie.expires,
      sessionData: sessionData // 클라이언트에서 보낸 세션 데이터
    }
  });
});



app.post('/userLogout', (req, res) => {
  // 로그아웃 전 세션 정보 출력
  console.log('로그아웃 전 세션 정보: ', req.session);
  console.log('현재 로그인 상태:', req.session.user);
  console.log('세션 ID:', req.sessionID);
  console.log('세션 만료 시간:', req.session.cookie.expires);
  // 로그인 여부 확인
  if (req.session.user) {
    console.log('로그인된 사용자 정보: ', req.session.user);
  } else {
    console.log('로그인된 사용자가 없습니다.');
  }

  // 세션 무효화
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send({ message: '로그아웃 중 오류 발생' });
    }

    // 클라이언트 측 쿠키 삭제
    res.clearCookie('toon_ID_Check');

    return res.send({ message: '모든 웹에서 로그아웃되었습니다.' });
  });
});

// 세션 상태 확인 API
app.get('/checkSession', (req, res) => {
  if (!req.session.user) {
    console.log('현재 로그인 상태:', req.session.user);
    console.log('세션 ID:', req.sessionID);
    console.log('세션 생성 시간:', req.session.created);
    console.log('세션 만료 시간:', req.session.cookie.expires);
    return res.send({ loggedIn: true, user: req.session.user });
  } else {
    console.log('현재 로그인 상태: 없음');
    console.log('세션 ID:', req.sessionID);
    return res.send({ loggedIn: false });
  }
});


app.listen(port, () => {
  console.log(`Hello`)
})
//  callender.js 전송

const callenderTextList = []

app.post('/callender', (req, res) => {
  const { memo, date, userId } = req.body;
  console.log(memo);
  console.log(date);
  console.log(userId);
  // 이름과 내용을 분리
const [userName, text] = memo.split(':').map(item => item.trim());
const query = 'SELECT User_StoreName FROM new_table WHERE new_tablecol2 = ?';

connection.query(query, [userId], (error, results) => {
  if (error) {
    console.error('Error fetching data:', error);
    return;
  } else {
    if (results.length > 0) {
      const userStoreName = results[0].User_StoreName;
      console.log(userStoreName); // '대구가톨릭대학교' 출력
        // 데이터베이스에 새로운 레코드를 삽입하는 쿼리문
  const insertQuery = "INSERT INTO CallenderText (textDay, text, TextUserName,StoreName) VALUES (?, ?, ?,?)";

  connection.query(insertQuery, [date, text, userName ,userStoreName], (error, results) => {
    if (error) {
      console.error("Error inserting data: ", error);
      if (!res.headersSent) {
        res.status(500).send('Error inserting data');
      }
      return;
    }
    
    // memo, date, userId를 배열에 추가
    callenderTextList.push({ memo, date, userId });

 
  });
    } else {
      console.log('No results found');
    }
  }
})});


app.delete('/callender', (req, res) => {
  // 요청을 처리하는 로직
  const {memo, date, userId } = req.body;
  const [name, number] = memo.split(': ');
  const UserText = number.trim() 
  console.log(UserText, date , userId); 


const query = 'DELETE FROM callenderText WHERE textday = ? AND text = ?';
const values = [date, UserText];

connection.query(query, values, (error, results) => {
  if (error) {
    return console.error('Error executing query:', error);
  }
  console.log('Number of rows deleted:', results.affectedRows);
});

  res.send('DELETE 요청을 받았습니다.');
});


// GET 요청 처리 (데이터베이스에서 데이터 가져오기)
app.post('/callender2', (req, res) => {
  const { UserFullID1 } = req.body;
  // 첫 번째 쿼리: userStoreName 값을 가져오기
  const userStoreNameQuery = 'SELECT User_StoreName FROM new_table WHERE new_tablecol2 = ?';
  connection.query(userStoreNameQuery, [UserFullID1], (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      const userStoreName = results[0].User_StoreName;
      console.log(userStoreName); // 예: '대구가톨릭대학교' 출력

      // 두 번째 쿼리: callenderText 테이블에서 storename이 userStoreName과 같은 데이터 선택
      const selectQuery = 'SELECT * FROM CallenderText WHERE storename = ?';
      connection.query(selectQuery, [userStoreName], (error, results) => {
        if (error) {
          console.error('Error fetching data: ', error);
          return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
          res.send(results);
        } else {
          // 결과가 없을 경우 userStoreName을 응답으로 보냄
          res.send({ userStoreName });
        }
      });
    } else {
      // userStoreName이 없을 경우 userStoreName을 응답으로 보냄
      res.send({ userStoreName: null });
    }
  });
});


// OusStore DB 전송
const StoreState = [];

app.post('/schduleStart', (req, res) => { 
  const { time, storeName, userId, userName, isRunning, today } = req.body;
  console.log(time, storeName, userId, userName, isRunning, today);

  const insertQuery = `INSERT INTO schedule (StartTime, MemberName, MemberId, StoreName, runningState, today) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(insertQuery, [time, userName, userId, storeName, isRunning, today], (error, results, fields) => {
    if (error) {
      console.error('쿼리 실행 중 오류 발생:', error);
      return res.status(500).send('서버 오류');
    }
    
    console.log('데이터 삽입 성공:', results);
    
    // 삽입된 데이터 출력
    const insertedData = {
      time,
      storeName,
      userId,
      userName,
      isRunning,
      today
    };
    
    console.log('삽입된 데이터:', insertedData); // 삽입된 데이터 출력

    // 삽입된 데이터와 일치하는 모든 값 조회
    const selectQuery = `SELECT * FROM schedule WHERE StartTime = ? AND MemberName = ? AND MemberId = ? AND StoreName = ? AND runningState = ? AND today = ?`;

    connection.query(selectQuery, [time, userName, userId, storeName, isRunning, today], (selectError, selectResults) => {
      if (selectError) {
        console.error('조회 중 오류 발생:', selectError);
        return res.status(500).send('서버 오류');
      }

      console.log('조회된 데이터:', selectResults); // 조회된 데이터 출력

      // 클라이언트에 응답
      res.status(200).json({ message: '데이터 삽입 성공', data: insertedData, retrievedData: selectResults });
    });
  });
});


app.post('/schdulefinish', (req, res) => { 
  const { isRunning, finishTime, UserFullName } = req.body;
  console.log(req.body);

  // MemberName이 UserFullName과 같은 레코드를 가져오는 쿼리
  const query = 'SELECT * FROM Schedule WHERE MemberName = ?';

  connection.query(query, [UserFullName], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Database query error');
      }

      // 결과가 없을 경우
      if (results.length === 0) {
          return res.status(404).send('No records found for the given UserFullName');
      }

      // 오늘 날짜 설정 (UTC)
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환

      // 오늘 날짜와 일치하거나 finishTime이 null인 StartTime만 추출
      const startTimesToday = results
          .filter(result => {
              const todayDate = new Date(result.today).toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
              return todayDate === formattedToday || result.finishTime === null; 
          })
          .map(result => result.StartTime);

      const currentTime = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
      let closestStartTime = null;
      let closestTimeDiff = Infinity;

      startTimesToday.forEach(startTime => {
          const [hours, minutes, seconds] = startTime.split(':').map(Number);
          const startTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

          const timeDiff = Math.abs(startTimeInSeconds - currentTime);

          if (timeDiff < closestTimeDiff) {
              closestTimeDiff = timeDiff;
              closestStartTime = startTime;
          }
      });

      if (closestStartTime) {
          const queryByStartTime = 'SELECT * FROM Schedule WHERE StartTime = ? AND MemberName = ?';
          
          connection.query(queryByStartTime, [closestStartTime, UserFullName], (err, filteredResults) => {
              if (err) {
                  console.error('Error executing query by StartTime:', err);
                  return res.status(500).send('Database query error');
              }

              if (filteredResults.length === 0) {
                  return res.status(404).send('No records found for the given StartTime');
              }

              // TotalTime 값을 가져오기
              const totalTimeQuery = 'SELECT TotalTime FROM Schedule WHERE MemberName = ?';
              connection.query(totalTimeQuery, [UserFullName], (err, totalTimeResults) => {
                  if (err) {
                      console.error('Error executing query for TotalTime:', err);
                      return res.status(500).send('Database query error');
                  }

                  // TotalTime 출력 및 가장 높은 TotalTime 찾기
                  let highestTotalTime = '0:00:00'; // 기본값 설정
                  const totalTimes = totalTimeResults.map(result => result.TotalTime || '0:00:00');

                  highestTotalTime = totalTimes.reduce((max, current) => {
                      const currentInSeconds = convertToSeconds(current);
                      const maxInSeconds = convertToSeconds(max);
                      return currentInSeconds > maxInSeconds ? current : max;
                  }, highestTotalTime);

                  // TotalTime 출력
                  console.log('TotalTime 값:', totalTimes);
                  console.log('가장 높은 TotalTime:', highestTotalTime);

                  // finishTime을 HH:mm:ss 형식으로 분리
                  const [finishHours, finishMinutes, finishSeconds] = finishTime.split(':').map(Number);

                  // finishTime을 초로 변환
                  const finishTimeInSeconds = convertToSeconds(finishTime);

                  // 가장 높은 TotalTime을 초로 변환
                  const highestTotalTimeInSeconds = convertToSeconds(highestTotalTime);

                  // runningTime 계산
                  const closestStartTimeDate = new Date();
                  const [startHours, startMinutes, startSeconds] = closestStartTime.split(':').map(Number);
                  closestStartTimeDate.setHours(startHours, startMinutes, startSeconds); // 시간, 분, 초 설정

                  const finishTimeDate = new Date(); // 현재 날짜로 설정
                  finishTimeDate.setHours(finishHours, finishMinutes, finishSeconds); // 시간, 분, 초 설정

                  // 차이 계산
                  const timeDifferenceInSeconds = Math.floor((finishTimeDate - closestStartTimeDate) / 1000);
                  const hoursDiff = Math.floor(timeDifferenceInSeconds / 3600);
                  const minutesDiff = Math.floor((timeDifferenceInSeconds % 3600) / 60);
                  const secondsDiff = timeDifferenceInSeconds % 60;

                  // NaN 체크
                  if (isNaN(hoursDiff) || isNaN(minutesDiff) || isNaN(secondsDiff)) {
                      console.error('Error calculating time difference');
                      return res.status(400).send('Error calculating time difference');
                  }

                  // runningTime을 "HH:mm:ss" 형식으로 변환
                  const runningTime = `${Math.abs(hoursDiff)}:${Math.abs(minutesDiff).toString().padStart(2, '0')}:${Math.abs(secondsDiff).toString().padStart(2, '0')}`;

                  // runningTime을 초로 변환
                  const runningTimeInSeconds = convertToSeconds(runningTime);

                  // 새로운 TotalTime 계산
                  const newTotalTimeInSeconds = highestTotalTimeInSeconds + runningTimeInSeconds;
                  const newTotalHours = Math.floor(newTotalTimeInSeconds / 3600);
                  const newTotalMinutes = Math.floor((newTotalTimeInSeconds % 3600) / 60);
                  const newTotalSeconds = newTotalTimeInSeconds % 60;

                  const newTotalTime = `${newTotalHours}:${newTotalMinutes.toString().padStart(2, '0')}:${newTotalSeconds.toString().padStart(2, '0')}`;

                  // 새로운 TotalTime 출력
                  console.log('업데이트할 새로운 TotalTime:', newTotalTime);

             // Schedule 테이블의 finishTime, runningState, runningTime, TotalTime 업데이트
const updateQuery = 'UPDATE Schedule SET finishTime = ?, runningState = ?, runningTime = ?, TotalTime = ? WHERE StartTime = ? AND MemberName = ?';

connection.query(updateQuery, [finishTime, '0', runningTime, newTotalTime, closestStartTime, UserFullName], (err, updateResult) => {
    if (err) {
        console.error('Error updating finishTime:', err);
        return res.status(500).send('Error updating finish time.');
    }

    // 업데이트 후 StartTime과 finishTime 출력
    console.log('업데이트된 StartTime:', closestStartTime);
    console.log('업데이트된 finishTime:', finishTime);
    console.log('업데이트된 runningTime:', runningTime);
    console.log('finishTime이 업데이트되었습니다:', updateResult);

    // 업데이트 조건에 일치하는 모든 값 조회
    const selectQuery = 'SELECT * FROM Schedule WHERE StartTime = ? AND MemberName = ?';
    connection.query(selectQuery, [closestStartTime, UserFullName], (err, selectResult) => {
        if (err) {
            console.error('Error retrieving updated values:', err);
            return res.status(500).send('Error retrieving updated values.');
        }

        // 조회된 모든 값 출력
        console.log('조회된 값들:', selectResult);

        // 응답 전송 (조회된 값을 포함)
        res.status(200).send({
       selectResult
        });
    });
});  
              })
          });
      } else {
          console.log('가까운 StartTime이 없습니다.');
          res.status(404).send('No closest StartTime found.');
      }
  });
});

// 시간을 초로 변환하는 함수
function convertToSeconds(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
}




app.post('/RunState', (req, res) => {
  const { isRunning, userId, StartTime,currentTime} = req.body;
  console.log(StartTime);
  console.log(isRunning);
  console.log(userId);
  console.log(scheduleData.time);

  const query = 'SELECT * FROM schedule WHERE MemberId = ? AND finishTime IS NULL';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database query error');
    }

    console.log('Query results:', results); // 쿼리 결과 출력

    if (results.length === 0) { 
      return res.status(404).send('No matching records found');
    }

    const runningState = isRunning ? '1' : '0';
    console.log(runningState)

    if(runningState !== '0'){
      const updateQuery = 'UPDATE schedule SET runningState = ?, StopTime = ? WHERE MemberId = ? AND finishTime IS NULL';
      connection.query(updateQuery, [runningState, currentTime, userId], (updateErr, updateResults) => {
          if (updateErr) {
              console.error('Error executing update query:', updateErr);
              return res.status(500).send('Database update error');
          }
          console.log('Update successful:', updateResults.affectedRows); // 업데이트된 행 수 출력
  
          // 업데이트된 레코드를 다시 조회하여 클라이언트로 보냄
          const selectUpdatedQuery = 'SELECT * FROM schedule WHERE MemberId = ? AND finishTime IS NULL';
          connection.query(selectUpdatedQuery, [userId], (selectErr, updatedRecords) => {
              if (selectErr) {
                  console.error('Error fetching updated records:', selectErr);
                  return res.status(500).send('Error fetching updated records');
              }
              console.log('dsd',updatedRecords)
              // 배열의 값들만 클라이언트로 보내기
              res.json(updatedRecords); // 업데이트된 레코드 배열만 응답
          });
      });
    }else {
      // "HH:mm:ss" 형태의 문자열을 총 초(second)로 변환하는 함수
      function parseHhMmSsToSeconds(timeStr) {
          if (!timeStr) return 0;
          const parts = timeStr.split(':');
          if (parts.length === 3) {
              const h = parseInt(parts[0] || '0', 10);
              const m = parseInt(parts[1] || '0', 10);
              const s = parseInt(parts[2] || '0', 10);
              return h * 3600 + m * 60 + s;
          }
          return 0; // 파싱 실패 시 0 반환
      }
  
      // "X시간 Y분 Z초" 형태의 문자열을 총 초(second)로 변환하는 함수
      function parseDurationStringToSeconds(durationStr) {
          let totalSeconds = 0;
          if (durationStr) {
              const hoursMatch = durationStr.match(/(\d+)시간/);
              const minutesMatch = durationStr.match(/(\d+)분/);
              const secondsMatch = durationStr.match(/(\d+)초/);
  
              const h = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
              const m = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
              const s = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
  
              totalSeconds = h * 3600 + m * 60 + s;
          }
          return totalSeconds;
      }
  
      // 총 초(second)를 "HH:mm:ss" 형태로 변환하는 함수 (24시간 넘어도 표시)
      function formatTotalSecondsToHhMmSs(totalSeconds) {
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
  
          // 자릿수 맞추기 (Padding)
          const paddedH = String(h).padStart(2, '0');
          const paddedM = String(m).padStart(2, '0');
          const paddedS = String(s).padStart(2, '0');
  
          return `${paddedH}:${paddedM}:${paddedS}`;
      }
  
      // StartTime, StopTime, TotalStopTime 값을 가져오는 쿼리
      const selectTimesQuery = 'SELECT StartTime, StopTime, TotalStopTime FROM schedule WHERE MemberId = ? AND finishTime IS NULL';
      connection.query(selectTimesQuery, [userId], (selectErr, results) => {
          if (selectErr) {
              console.error('Error fetching time values:', selectErr);
              return res.status(500).send('Error fetching time values');
          }
  
          // 값 확인 및 처리
          if (results.length > 0) {
            const startTimeStr = results[0].StartTime;
            const stopTime = new Date(results[0].StopTime);
            const existingTotalStopTimeStr = results[0].TotalStopTime; // 업데이트 전 기존 TotalStopTime 값

            console.log('Current StopTime:',   stopTime);
            console.log('Existing TotalStopTime (string, before update):', existingTotalStopTimeStr);
            console.log('Existing StartTime (string):', startTimeStr);

            // 현재 시간 가져오기 (KST)
            const now = new Date();
            const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // UTC로 변환
            const koreaTimeDiff = 9 * 60 * 60 * 1000; // KST는 UTC+9
            const koreaNow = new Date(utcNow + koreaTimeDiff); // KST로 변환

            // StopTime과 현재 시간 차이 계산 (밀리초 단위)
            const timeDifference = koreaNow - stopTime;

             // 차이를 시, 분, 초로 변환 - 로깅용
            const diffSeconds = Math.floor((timeDifference / 1000) % 60);
            const diffMinutes = Math.floor((timeDifference / (1000 * 60)) % 60);
            const diffHours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

            console.log('Current KST:', koreaNow);
            console.log(`Time difference (ms): ${timeDifference}`); // 밀리초 단위 차이 로깅
            console.log(`Time difference: ${diffHours}시간 ${diffMinutes}분 ${diffSeconds}초`); // 포맷팅된 차이 로깅


            // 기존 TotalStopTime 문자열을 밀리초로 변환 (업데이트 계산용)
            // 이 함수는 네 코드에 있다고 가정할게!
            // parseDurationStringToSeconds(existingTotalStopTimeStr)
            let existingTotalStopTimeMsForUpdate = parseDurationStringToSeconds(existingTotalStopTimeStr) * 1000;

             console.log('Existing TotalStopTime (parsed to ms for update calculation):', existingTotalStopTimeMsForUpdate);

            // 새로운 총 누적 시간 (밀리초) 계산
            const newTotalStopTimeMs = existingTotalStopTimeMsForUpdate + timeDifference;

            // 새로운 총 누적 시간 (밀리초)을 "HH:MM:SS" 형식의 문자열로 변환 (DB 저장용)
            const totalSecondsForFormat = Math.floor(newTotalStopTimeMs / 1000);

            const hours = Math.floor(totalSecondsForFormat / 3600);
            const minutes = Math.floor((totalSecondsForFormat % 3600) / 60);
            const seconds = totalSecondsForFormat % 60;

            // 각 부분을 두 자릿수로 포맷팅 (예: 5 -> 05)
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            // "HH:MM:SS" 형태로 합치기
            const formattedTotalTimeForDB = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

            console.log('Formatted TotalStopTime for DB:', formattedTotalTimeForDB); // DB 저장될 최종 형식 로깅

            // 이제 formattedTotalTimeForDB 변수에 "HH:MM:SS" 형태로 잘 들어가 있을 거야!

  
  
              console.log('Calculated New TotalStopTime (ms):', newTotalStopTimeMs);
              console.log('Formatted New TotalStopTime (for DB update):', formattedTotalTimeForDB); // <-- DB에 저장될 새로운 값 로깅
  

                
              // 업데이트 쿼리 실행
              const updateQuery = 'UPDATE schedule SET runningState = ?, TotalStopTime = ? WHERE MemberId = ? AND finishTime IS NULL';
              connection.query(updateQuery, [runningState, formattedTotalTimeForDB, userId], (updateErr, updateResults) => {
                  if (updateErr) {
                      console.error('Errorexecuting update query:', updateErr);
                      return res.status(500).send('Database update error');
                  }
  
                  console.log('Update successful:', updateResults); // 업데이트 결과 출력
  
                  // 업데이트된 레코드를 다시 조회하여 클라이언트로 보내고 콘솔에 출력
                  const selectUpdatedQuery = 'SELECT * FROM schedule WHERE MemberId = ? AND finishTime IS NULL';
                  connection.query(selectUpdatedQuery, [userId], (selectErr, updatedRecords) => {
                      if (selectErr) {
                          console.error('Error fetching updated records:', selectErr);
                          return res.status(500).send('Error fetching updated records');
                      }
  
                      if (updatedRecords.length > 0) {
                          // --- StartTime(문자열)과 업데이트된 TotalStopTime(문자열)을 더해서 콘솔에 출력하는 로직 ---
                          const latestStartTimeStr = updatedRecords[0].StartTime; // <-- 다시 가져온 StartTime
                          const latestTotalStopTimeStr = updatedRecords[0].TotalStopTime; // <-- DB에서 업데이트된 TotalStopTime 값
  
                          // StartTime 문자열을 총 초로 변환
                          const startTimeSeconds = parseHhMmSsToSeconds(latestStartTimeStr);
                          // 업데이트된 TotalStopTime 문자열을 총 초로 변환
                          const totalStopTimeSeconds = parseDurationStringToSeconds(latestTotalStopTimeStr);
  
                          // 두 값을 더한 총 시간 (초)
                          const totalEffectiveTimeSeconds = startTimeSeconds + totalStopTimeSeconds;
  
                          // 총 초를 "HH:mm:ss" 형식으로 변환
                          const formattedEffectiveTime = formatTotalSecondsToHhMmSs(totalEffectiveTimeSeconds);
       
                          // 결과를 콘솔에 출력 (업데이트된 TotalStopTime 사용)
                          console.log(`>>> StartTime (${latestStartTimeStr}) + TotalStopTime (updated: ${latestTotalStopTimeStr}) = Effective Time: ${formattedEffectiveTime}`);
                           // --- 콘솔 출력 로직 끝 ---
  
                      } else {
                           console.log('Updated record not found after second select.');
                      }
                      // 배열의 값들만 클라이언트로 보내기
                      res.json(updatedRecords); // 업데이트된 레코드 배열만 응답
                  });
              });
  


              

              
          } else {
              console.log('No active records found for the given MemberId.');
              res.status(404).send('No active record found.');
          }
      });
  }
  
 
  });
});

let scheduleData = {};  


app.post('/schduleLoding', (req, res) => {
  const { UserFullID1, today } = req.body;
  console.log(UserFullID1, today);

  // 첫 번째 쿼리: userStoreName 값을 가져오기
  const userStoreNameQuery = 'SELECT User_StoreName FROM new_table WHERE new_tablecol2 = ?';
  connection.query(userStoreNameQuery, [UserFullID1], (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length === 0) {
      // 결과가 없을 경우
      return res.status(404).send('No matching User_StoreName found');
    }
    console.log(results);
    const userStoreName = results[0].User_StoreName;
    console.log(userStoreName); // 예: '대구가톨릭대학교' 출력

    const scheduleQuery = `
    SELECT * 
    FROM schedule 
    WHERE StoreName = ?
    AND finishTime IS NULL
  `;
  connection.query(scheduleQuery, [userStoreName], (error, scheduleResults) => {
    if (error) { 
      console.error('Error fetching schedule data:', error);
      return res.status(500).send('Internal Server Error');
    }
    console.log(scheduleResults);
    res.send(scheduleResults);
  });
  });
});


/*
const storeCode = '74394bc5'; // 예시 값
const query = `SELECT * FROM User_Store_Member_List WHERE \`${storeCode}\` = ?`; // storeCode를 열 이름으로 사용

connection.query(query, [storeCode], (error, userStoreRows) => {
  if (error) {
    console.error(error);
    return; // 에러가 발생하면 함수 종료
  }

  // 조회된 값이 없을 경우 메시지 출력
  if (userStoreRows.length === 0) {
    console.log("값이 없습니다.");
  } else {
    // 조회된 모든 값을 콘솔에 출력
    userStoreRows.forEach(row => {
      console.log(row); // 각 행을 출력
      // 만약 특정 열의 값을 출력하고 싶다면, 예를 들어 'columnName'이라는 열의 값을 출력하려면:
      // console.log(row.columnName);
    });
  }
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');

  const query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'User_Store_Member_List'";
  
  connection.query(query, (error, results) => {
    if (error) throw error;
    const columnNames = results.map(row => row.COLUMN_NAME);
    console.log('Column Names:', columnNames);
    
    connection.end();
  });
});
*/

  app.post('/StoreDB2', (req, res) => { 
    const { UserFullID1, today } = req.body;
    // 첫 번째 쿼리: new_table에서 representId 가져오기
    connection.query("SELECT * FROM new_table WHERE new_tablecol2 = ?", [UserFullID1], (error, rows) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database query error' });
      }
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No matching records found' });
      }
  
      const represent_ID = rows[0].representId;
  
      // 두 번째 쿼리: representId로 storeCode 가져오기
      connection.query("SELECT * FROM new_table WHERE new_tablecol2 = ?", [represent_ID], (error, rows) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Database query error' });
        }
  
        if (rows.length === 0) {
          console.log('일치하는 값이 없습니다.');
          return res.status(404).json({ error: 'No matching records found' });
        }
  
        const storeCode = rows[0].Store_Code;
        console.log(`가져온 storeCode: ${storeCode}`);
  
        // 세 번째 쿼리: User_StoreDB에서 데이터 가져오기
        connection.query("SELECT * FROM User_StoreDB", (error, rows) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query error' });
          }
  
          // 네 번째 쿼리: User_Store_Member_List에서 storeCode 확인
          connection.query("SELECT * FROM User_Store_Member_List", (error, memberRows) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Database query error' });
            }
  
            if (memberRows.length === 0) {
              console.log('User_Store_Member_List 테이블에 데이터가 없습니다.');
              return res.status(404).json({ error: 'No data in User_Store_Member_List' });
            }
  
            const columnNames = Object.keys(memberRows[0]);
  
            if (!columnNames.includes(storeCode)) {
              console.log('일치하는 열이 없습니다.');
              return res.status(404).json({ error: 'No matching column found' });
            }
  
            console.log(`일치하는 열이 있습니다: ${storeCode}`);
  
            // 해당 열의 값을 출력하고 널값 제외
            const filteredValues = memberRows
              .map(row => row[storeCode])
              .filter(value => value !== null && value !== undefined);
  
            const userNames = [];
            const storeStates = [];
  
            // filteredValues를 하나하나 new_table에 조회
            const queries = filteredValues.map(value => {
              return new Promise((resolve, reject) => {
                connection.query("SELECT User_Name FROM new_table WHERE new_tablecol2 = ?", [value], (error, userRows) => {
                  if (error) {
                    console.error(error);
                    return reject(error);
                  }
  
                  if (userRows.length > 0) {
                    userRows.forEach(userRow => {
                      console.log(`User_Name: ${userRow.User_Name}`);
                      userNames.push(userRow.User_Name);
                    });
                  } else {
                    console.log(`new_table에서 ${value}에 대한 User_Name이 없습니다.`);
                  }
  
                  // StoreState 추가
                  rows.forEach(row => {
                    // User_ID가 represent_ID와 일치하는 경우만 추가
                    if (row.User_ID === represent_ID) {
                      storeStates.push({
                        User_ID: row.User_ID,
                        User_StoreName: row.User_StoreName,
                        representative_User: row.representative_User,
                        representativeTel: row.representativeTel,
                        representative_Number: row.representative_Number,
                        Stroe_location: row.Stroe_location,
                      });
                    }
                  });
  
                  resolve();
                });
              });
            });
  
            // 모든 쿼리가 완료된 후 응답
            Promise.all(queries)
              .then(() => {
                const result = {
                  userNames: userNames,
                  storeStates: storeStates,
                };
                res.json(result);
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Error processing user names' });
              });
          });
        });
      });
    });
  });
  





  app.get('/StoreDB2',(req,res)=>{
    res.json(StoreState); 
  })



// 가게 스토어

const StoreData =[{
  Store_Name : '',
  UserFullName : '',
  representativeName : '',
  representativeTel : '',
  BusinessNumber : '',
  StoreLocation : ''
}]




app.post('/StoreDB', (req, res) => { 
  const { Store_Name, UserFullID, representativeName, representativeTel, BusinessNumber, StoreLocation } = req.body;
  const crypto = require('crypto');

  const randomBytes = crypto.randomBytes(4).toString('hex');
  console.log(randomBytes);

  connection.query("SELECT * FROM new_table WHERE new_tablecol2=?", UserFullID, (error, rows) => {
    if (error) throw error;

    // new_table에서 UserFullID와 일치하는 레코드가 있는 경우
    if (rows.length > 0) {
      // Store_Code 값을 randomBytes로 업데이트
      connection.query("UPDATE new_table SET Store_Code = ? WHERE new_tablecol2 = ?", [randomBytes, UserFullID], (error, result) => {
        if (error) throw error;

        // 나머지 쿼리 실행
        connection.query("UPDATE new_table SET User_StoreName = ? WHERE new_tablecol2 = ?", [Store_Name.Name, UserFullID], (error, result) => {
          if (error) throw error;

          connection.query("UPDATE new_table SET representId = ? WHERE new_tablecol2 = ?", [UserFullID, UserFullID], (error, result) => {
            if (error) throw error;
          });

          connection.query("ALTER TABLE User_Store_Member_List ADD ?? VARCHAR(64)", [randomBytes], (error, result) => {
            if (error) throw error;

         // 쿼리 실행
const query = `SELECT \`${randomBytes}\` FROM User_Store_Member_List`;
connection.query(query, (err, results) => {
    if (err) {
        console.error('쿼리 실행 실패:', err);
        return;
    }

    // 결과 출력
    console.log('쿼리 결과:', results);

    // null 값을 가진 첫 번째 칼럼 찾기
    let userFullID = null;
    for (const row of results) {
        if (row[randomBytes] === null) {
            userFullID = UserFullID;
            break; // null 값을 찾으면 루프 종료
        }
    }

    if (userFullID !== null) {
        // null 값이 있는 경우, 해당 칼럼에 UserFullID 값 업데이트
        const updateQuery = `UPDATE User_Store_Member_List SET \`${randomBytes}\` = ? WHERE \`${randomBytes}\` IS NULL LIMIT 1`;
        connection.query(updateQuery, [userFullID], (updateErr) => {
            if (updateErr) {
                console.error('업데이트 실패:', updateErr);
            } else {
                console.log('업데이트 성공:', userFullID);
            }
        });
    } else {
        // null 값이 없는 경우, 새 열 추가
        const insertQuery = `INSERT INTO User_Store_Member_List (\`${randomBytes}\`) VALUES (?)`;
        connection.query(insertQuery, [userFullID], (insertErr) => {
            if (insertErr) {
                console.error('삽입 실패:', insertErr);
            } else {
                console.log('새로운 열 추가 성공:', userFullID);
            }
        });
    }
});

          });
        });
      });
    } else {
      // UserFullID와 일치하는 레코드가 없는 경우 처리
      return res.status(404).send({ message: "User not found in new_table." });
    }
  });

  // 유저 가게 데이터 sql, NewStore
  const UserDB = [{
    User_ID: UserFullID,
    User_StoreName: Store_Name.Name,
    representative_User: representativeName.representativeName,
    representative_Number: BusinessNumber.BusinessNum,
    representativeTel: representativeTel.Tel,
    Stroe_location: StoreLocation.StoreLocation,
    StoreCode: randomBytes
  }];

  connection.query("INSERT IGNORE INTO User_StoreDB SET ?", UserDB, (error, rows) => {
    if (error) throw error;
  });

  StoreData.push({
    User_ID: UserFullID,
    Store_Name: Store_Name.Name,
    representative_User: representativeName.representativeName,
    representative_Number: BusinessNumber.BusinessNum,
    representativeTel: representativeTel.Tel,
    Stroe_location: StoreLocation.StoreLocation,
    StoreCode: randomBytes
  });

  return res.send(StoreData);  
});


   

   // 유저 멤버추가 sql
  const StoreMemberList =[{
  }]
app.get('/StoreMemberPlus',(req,res)=>{
  res.json(StoreMemberList); 
})



app.post('/StoreMemberPlus', (req, res) => {
  const { MemberID, UserFullID } = req.body;
  let userStoreName; // User_StoreName을 저장할 변수
  let memberStoreName; // Member_StoreName을 저장할 변수

  // 첫 번째 쿼리: UserFullID에 대한 정보 가져오기
  connection.query("SELECT * FROM new_table WHERE new_tablecol2 = ?", UserFullID, (error, rows) => {
      if (error) {
          return res.status(500).send('서버 오류');
      }
      
      if (rows.length > 0) {
          userStoreName = rows[0].User_StoreName;
          console.log("User_StoreName:", userStoreName);
      } else {
          console.log("유저는 존재하지 않습니다.");
          return res.status(404).send('유저를 찾을 수 없습니다.');
      }

      // 두 번째 쿼리: MemberID에 대한 정보 가져오기
      connection.query("SELECT * FROM new_table WHERE new_tablecol2 = ?", MemberID, (error, rows) => {
          if (error) {
              return res.status(500).send('서버 오류');
          }

          if (rows.length > 0) {
              memberStoreName = rows[0].User_StoreName;
              console.log("Member_StoreName:", memberStoreName);

              // 두 스토어네임 값이 일치하는지 확인
              if (userStoreName && memberStoreName) {
                  if (userStoreName === memberStoreName) {
                      console.log("이 유저는 이미 가게에 소속된 사람입니다.");
                      return res.status(400).send('이미 소속된 유저입니다.');
                  } else {
                      console.log("이 유저는 다른 가게에 소속된 사람입니다.");
                  }
              }

              // MemberStoreName이 비어있는 경우
              if (memberStoreName === '') {
                  const query = `
                      SELECT * FROM Wait_regi 
                      WHERE rep_Id = ? AND Member_Id = ?
                  `;

                  connection.execute(query, [UserFullID, MemberID], (err, results) => {
                      if (err) {
                          console.error(err);
                          return res.status(500).send('서버 오류');
                      }

                      if (results.length > 0) {
                          console.log('대기중입니다');
                          return res.json({ message: '요청을 대기중입니다' });
                      } else {
                          console.log('대기해주세요');

                          // 현재 시간 가져오기
                          const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS' 형식

                          // 새로운 레코드를 삽입하는 쿼리
                          const insertQuery = `
                              INSERT INTO Wait_regi (rep_Id, Member_Id, Time, State) 
                              VALUES (?, ?, ?, ?)
                          `;

                          connection.execute(insertQuery, [UserFullID, MemberID, currentTime, 'wait'], (insertErr, insertResults) => {
                              if (insertErr) {
                                  console.error(insertErr);
                                  return res.status(500).send('서버 오류');
                              }

                              return res.json({ message: '대기해주세요' });
                          });
                      }
                  });
              }
          } else {
              return res.status(404).send('멤버를 찾을 수 없습니다.');
          }
      });
  });
});


// 스케줄 검색에서 달력 클릭시 이벤트 발생
app.post('/schduleSearch', (req, res) => {
  const { UserFullName, finishTime, isRunning, UserfullId } = req.body;
  // console.log(UserFullName, UserfullId, finishTime);

  const formattedDate = finishTime
      .replace(/\./g, '') // 점(.) 제거
      .replace(/\s+/g, '-') // 공백을 하이픈(-)으로 변환
      .trim(); // 앞뒤 공백 제거

  // YYYY-MM-DD 형식으로 변환
  const [year, month, day] = formattedDate.split('-');

  // ISO 8601 형식으로 변환
  const isoFormattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;

  // isoFormattedDate에서 T 이후 부분 삭제
  const indexOfT = isoFormattedDate.indexOf('T');
  const modifiedIsoDate = indexOfT !== -1 ? isoFormattedDate.substring(0, indexOfT) : isoFormattedDate;

  // console.log('수정된 ISO 날짜:', modifiedIsoDate);
  
  // UserfullId를 사용하여 new_table에서 조회
  const query = 'SELECT User_StoreName FROM new_table WHERE new_tablecol2 = ?';
  
  connection.execute(query, [UserfullId], (error, results) => {
      if (error) {
          console.error('쿼리 실행 중 오류 발생:', error);
          return res.status(500).send('서버 오류');
      }

      // 결과가 있을 경우 User_StoreName을 사용하여 Schedule 테이블 조회
      if (results.length > 0) {
          const storeNames = results.map(row => row.User_StoreName);
          // console.log('찾은 StoreName:', storeNames);

          // Schedule 테이블에서 StoreName과 일치하는 값 조회
          const placeholders = storeNames.map(() => '?').join(',');
          const scheduleQuery = `SELECT * FROM Schedule WHERE StoreName IN (${placeholders})`;
          
          connection.execute(scheduleQuery, storeNames, (error, scheduleResults) => {
              if (error) {
                  console.error('Schedule 테이블 조회 중 오류 발생:', error);
                  return res.status(500).send('서버 오류');
              }

              // Schedule 테이블의 결과에서 today 칼럼만 추출
              const todayValues = scheduleResults.map(schedule => schedule.today);

              // today 값이 있는 경우 출력
              if (todayValues.length > 0) {
                  // todayValues의 각 값을 KST로 변환
                  const modifiedTodayValues = todayValues.map(value => {
                      if (value instanceof Date) {
                          // UTC로부터 KST로 변환
                          const utcDate = new Date(value);
                          const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // 9시간 추가
                          const isoString = kstDate.toISOString();
                          const indexOfT = isoString.indexOf('T');
                          return indexOfT !== -1 ? isoString.substring(0, indexOfT) : isoString;
                      }
                      return String(value);
                  });

                  // 변환된 값과 타입을 콘솔에 출력
                  modifiedTodayValues.forEach(value => {
                      // console.log(`값: ${value}, 타입: ${typeof value}`);
                  });

                  // console.log('추출한 today 값:', modifiedTodayValues);

                  // modifiedIsoDate와 todayValues에서 일치하는 값 찾기
                  const matchingValues = modifiedTodayValues.filter(value => value === modifiedIsoDate);

                  // 일치하는 값이 있는 경우 출력
                  if (matchingValues.length > 0) {
                      console.log('일치하는 값:', matchingValues);

                      // 일치하는 today 값으로 Schedule 테이블에서 다시 조회
                      const matchingPlaceholders = matchingValues.map(() => '?').join(',');
                      const matchingScheduleQuery = `SELECT * FROM Schedule WHERE today IN (${matchingPlaceholders})`;

                      connection.execute(matchingScheduleQuery, matchingValues, (error, matchingScheduleResults) => {
                          if (error) {
                              console.error('일치하는 Schedule 조회 중 오류 발생:', error);
                              return res.status(500).send('서버 오류');
                          }

                          // 일치하는 Schedule 결과 반환
                          if (matchingScheduleResults.length > 0) {
                              console.log('일치하는 Schedule 결과:', matchingScheduleResults);
                              res.status(200).send({ modifiedIsoDate, matchingValues, matchingScheduleResults });
                          } else {
                              console.log('일치하는 Schedule 결과가 없습니다.');
                              res.status(404).send({ message: '일치하는 Schedule 결과가 없습니다.' });
                          }
                      });
                  } else {
                      console.log('일치하는 값이 없습니다.');
                             res.status(200).send({ modifiedIsoDate, matchingValues,  matchingScheduleResults: [] });
                  }
              } else {
                  console.log('Schedule 레코드에서 today 값이 없습니다.');
                  res.status(404).send({ message: '일치하는 레코드가 없습니다.' });
              }

          });
      } else {
          console.log('일치하는 new_table 레코드가 없습니다.');
          res.status(404).send({ message: '일치하는 레코드가 없습니다.' });
      }
  }); 
});

app.post('/Searchloding', (req, res) => {
  const { UserfullId, User } = req.body;

  // UserfullId에서 ID 추출
  console.log('User ID:', UserfullId.UserID.ID);

  // SQL 쿼리 작성: new_table에서 new_tablecol2가 UserfullId와 일치하는 User_StoreName 조회
  const query = 'SELECT User_StoreName FROM new_table WHERE new_tablecol2 = ?';

  connection.execute(query, [UserfullId.UserID.ID], (error, results) => {
      if (error) {
          console.error('쿼리 실행 중 오류 발생:', error);
          return res.status(500).send('서버 오류');
      }

      // 결과가 있을 경우 User_StoreName을 출력
      if (results.length > 0) {
          const storeNames = results.map(row => row.User_StoreName);
          console.log(storeNames[0]); // StoreName 출력
          console.log('쿼리 결과:', results); // 쿼리 결과 전체 출력

          // 찾은 User_StoreName을 기반으로 다시 조회
          const matchedStoreNamesQuery = 'SELECT * FROM new_table WHERE User_StoreName IN (?)';
          
          connection.execute(matchedStoreNamesQuery, [storeNames[0]], (error, matchedStoreResults) => {
              if (error) {
                  console.error('재조회 중 오류 발생:', error);
                  return res.status(500).send('서버 오류');
              }

              if (matchedStoreResults.length > 0) {
                  console.log('일치하는 레코드:', matchedStoreResults); // 일치하는 레코드 출력

                  // User_Name만 추출
                  const userNames = matchedStoreResults.map(row => row.User_Name);
                  console.log('User Names:', userNames); // User_Name 출력

                  res.status(200).send({ storeNames, userNames, matchedStoreResults });
              } else {
                  console.log('일치하는 StoreName 레코드가 없습니다.');
                  res.status(404).send({ message: '일치하는 StoreName 레코드가 없습니다.' });
              }
          });
      } else {
          console.log('일치하는 new_table 레코드가 없습니다.');
          res.status(404).send({ message: '일치하는 레코드가 없습니다.' });
      }
  });
});

// scheduleMainSearch 엔드포인트
app.post('/scheduleMainSearch', (req, res) => {
  const selectedUser = req.body.selectedUser; // 요청 본문에서 selectedUser를 가져옵니다.

  if (!selectedUser) {
    return res.status(400).json({ error: 'selectedUser가 필요합니다.' });
  }

  // 나머지 로직을 여기에 추가
  console.log('선택된 유저:', selectedUser);

  // 예시 응답
  res.json({ message: '성공적으로 검색했습니다.', user: selectedUser });
});

// 매일 00시 00분에 실행
cron.schedule('0 0 * * *', () => {
  console.log('매일 00시 00분에 실행됩니다.');

  // 모든 today 값을 0으로 업데이트하는 쿼리
  const updateQuery = 'UPDATE schedule SET runningState = 0';

  connection.query(updateQuery, (error, results) => {
    if (error) {
      console.error('runningState 값을 0으로 업데이트하는 중 오류 발생:', error);
      return;
    }

    console.log('모든 runningState 값을 0으로 업데이트 완료:', results);
  });

  // finishTime이 NULL인 값을 0:00:00으로 업데이트하는 쿼리
  const nullFinishTimeQuery = 'UPDATE schedule SET finishTime = "00:00:00" WHERE finishTime IS NULL';

  connection.query(nullFinishTimeQuery, (error, results) => {
    if (error) {
      console.error('finishTime을 0:00:00으로 업데이트하는 중 오류 발생:', error);
      return;
    }

    console.log('NULL인 finishTime 값을 0:00:00으로 업데이트 완료:', results);
  });

  // 현재 날짜 (KST) 가져오기
  const currentDate = new Date();
  const kstCurrentDate = new Date(currentDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const formattedCurrentDate = kstCurrentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식

  // today 값을 모두 조회하는 쿼리
  const query = 'SELECT today FROM schedule';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('쿼리 실행 오류:', error);
      return;
    }

    // today 값을 KST 형태로 변환하고 현재 날짜와 비교
    const matchingTodayValues = results
      .map(row => {
        const date = new Date(row.today);
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        return kstDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
      })
      .filter(date => date === formattedCurrentDate); // 현재 날짜와 일치하는 값 필터링

    console.log('현재 날짜와 일치하는 today 값:', matchingTodayValues);

    // 일치하는 today 값으로 전체 데이터 조회
    if (matchingTodayValues.length > 0) {
      const matchingDates = matchingTodayValues.map(date => `'${date}'`).join(', '); // SQL 쿼리에 사용할 형식으로 변환
      const fullQuery = `SELECT * FROM schedule WHERE today IN (${matchingDates})`;

      connection.query(fullQuery, (error, fullResults) => {
        if (error) {
          console.error('전체 데이터 조회 오류:', error);
          return;
        }

        console.log('일치하는 전체 데이터:', fullResults);
      });
    } else {
      console.log('현재 날짜와 일치하는 today 값이 없습니다.');
    }
  });
});


// 게시판 데이터
app.post('/MainNoticeBoardLoading', (req, res) => {
  const { UsID } = req.body;
  console.log(UsID);

  const query = `
      SELECT User_StoreName 
      FROM new_table 
      WHERE new_tablecol2 = ?
  `;

  const values = [UsID];

  connection.query(query, values, (error, results) => {
      if (error) {
          console.error('쿼리 실행 중 오류:', error);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      // User_StoreName만 추출
      const storeNames = results.map(row => row.User_StoreName);

      // StoreName이 일치하는 NoticeBoard 테이블의 모든 값 조회
      if (storeNames.length > 0) {
          // StoreName을 쿼리의 IN 절에 맞게 변환
          const storeNamesPlaceholder = storeNames.map(() => '?').join(','); // 👈 올바른 변수명

          const fullQuery = `
              SELECT * 
              FROM NoticeBoard 
              WHERE StoreName IN (${storeNamesPlaceholder}) 
          `;

          connection.query(fullQuery, storeNames, (noticeBoardError, noticeBoardResults) => {
              if (noticeBoardError) {
                  console.error('NoticeBoard 쿼리 실행 중 오류:', noticeBoardError);
                  return res.status(500).json({ success: false, error: 'Internal Server Error' });
              }

              // 모든 값을 콘솔에 출력
              console.log('NoticeBoard 데이터:', noticeBoardResults);

              // 응답으로 User_StoreName 배열 전송
              res.status(200).json({ success: true, data: storeNames, noticeBoardData: noticeBoardResults });
          });
      } else {
          console.log('일치하는 StoreName이 없습니다.');
          res.status(404).json({ success: false, message: '일치하는 StoreName이 없습니다.' });
      }
  });
});


// 경로 정의
app.post('/MainNoticeBoardMake', (req, res) => {
  const { UsID, title, content } = req.body;

  // new_table에서 User_StoreName과 User_Name 가져오기
  const query = 'SELECT User_StoreName, User_Name FROM new_table WHERE new_tablecol2 = ?';
  connection.query(query, [UsID], (error, results) => {
      if (error) {
          console.error('데이터베이스 조회 오류:', error);
          return res.status(500).json({ success: false, message: '서버 오류' });
      }

      if (results.length > 0) {
          // User_StoreName과 User_Name 값을 가져오기
          const userStoreName = results[0].User_StoreName;
          const userName = results[0].User_Name;
          console.log('User_StoreName:', userStoreName);
          console.log('User_Name:', userName); // User_Name 출력

          // 현재 시간 가져오기
          const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

          // NoticeBoard 테이블에 데이터 삽입 (userName 칼럼 추가)
          const insertQuery = `
              INSERT INTO NoticeBoard (User_ID, NoticeBoard_Name, NoticeBoard_Text, StoreName, Create_Time, userName)
              VALUES (?, ?, ?, ?, ?, ?)`;
          
          const values = [UsID, title, content, userStoreName, currentTime, userName]; // userName 추가

          connection.query(insertQuery, values, (insertError) => {
              if (insertError) {
                  console.error('데이터 삽입 오류:', insertError);
                  return res.status(500).json({ success: false, message: '서버 오류' });
              }

              // 응답 전송 (User_Name 포함)
              res.status(200).json({ 
                  success: true, 
                  message: '게시글이 저장되었습니다.', 
                  userName: userName // User_Name 포함
              });
          });
      } else {
          console.log('해당 UsID에 대한 User_StoreName이 없습니다.');
          res.status(404).json({ success: false, message: '해당 UsID에 대한 데이터가 없습니다.' });
      }
  });
});


// 경로 정의
app.post('/MainNoticeBoardDelete', (req, res) => {
  const { title, author, time, userName, UserID } = req.body;

  console.log('삭제 요청 데이터:', {
      title,
      author,
      time,
      userName,
      UserID
  });

  // SQL 삭제 쿼리
  const sql = `
      DELETE FROM NoticeBoard 
      WHERE User_ID = ? 
        AND NoticeBoard_Name = ? 
        AND Create_TIme = ? 
        AND NoticeBoard_Text = ? 
        AND userName = ?
  `;

  const values = [UserID, title, time, author, userName];

  connection.query(sql, values, (error, results) => {
      if (error) {
          console.error('삭제 오류:', error);
          return res.status(500).json({ message: '삭제 중 오류 발생' });
      }

      console.log('삭제된 행 수:', results.affectedRows);
      res.status(200).json({ message: '게시글 삭제 완료' });
  });
});



app.post('/ChatLoading', (req, res) => {
  const { userID } = req.body; // 요청 본문에서 userID 추출

  // SQL 쿼리 작성
  const query = `SELECT Store_Code, User_StoreName
                 FROM new_table 
                 WHERE new_tablecol2 = ?`;

  // 쿼리 실행
  connection.query(query, [userID], (error, results) => { 
      if (error) {
          console.error('쿼리 실행 오류:', error);
          return res.status(500).json({ success: false, message: '서버 오류' });
      }

      // 결과가 있을 경우 User_StoreName 칼럼 값을 클라이언트에 응답
      if (results.length > 0) {
          const storeNames = results.map(row => row.Store_Code);
          const User_StoreName = results.map(row => row.User_StoreName);
          console.log(storeNames);
          console.log(User_StoreName);

          connection.query("SELECT * FROM User_Store_Member_List", (error, memberRows) => {
              if (error) {
                  console.error(error);
                  return res.status(500).json({ error: 'Database query error' });
              }

              if (memberRows.length === 0) {
                  console.log('User_Store_Member_List 테이블에 데이터가 없습니다.');
                  return res.status(404).json({ error: 'No data in User_Store_Member_List' });
              }

              const columnNames = Object.keys(memberRows[0]);

              // storeNames가 배열이므로 includes를 사용하기 위해서는 각 요소를 확인해야 함
              const matchingColumns = storeNames.filter(storeCode => columnNames.includes(storeCode));

              if (matchingColumns.length === 0) {
                  console.log('일치하는 열이 없습니다.');
                  return res.status(404).json({ error: 'No matching column found' });
              }

              console.log(`일치하는 열이 있습니다: ${matchingColumns}`);

              // 해당 열의 값을 출력하고 널값 제외
              const filteredValues = memberRows
                  .map(row => row[storeNames])
                  .filter(value => value !== null && value !== undefined);

              const userNames = [];

              // filteredValues를 하나하나 new_table에 조회
              const queries = filteredValues.map(value => {
                  return new Promise((resolve, reject) => {
                      connection.query("SELECT User_Name FROM new_table WHERE new_tablecol2 = ?", [value], (error, userRows) => {
                          if (error) {
                              console.error(error);
                              return reject(error);
                          }

                          if (userRows.length > 0) {
                              userRows.forEach(userRow => {
                                  console.log(`User_Name: ${userRow.User_Name}`);
                                  userNames.push(userRow.User_Name); // userNames에 추가
                              });
                          } else {
                              console.log(`new_table에서 ${value}에 대한 User_Name이 없습니다.`);
                          }

                          resolve();
                      });
                  });
              });

              // 모든 쿼리가 완료된 후 응답
              Promise.all(queries)
              .then(() => {
                const chatQuery = `
                    SELECT * 
                    FROM ChatText 
                    WHERE roomName IN (?)`; // IN 쿼리 사용
            
                // 첫 번째 쿼리 실행
                connection.query(chatQuery, [storeNames], (error, chatResults) => {
                    if (error) {
                        console.error('ChatText 조회 오류:', error);
                        return res.status(500).json({ success: false, message: '서버 오류' });
                    }
            
                    // 두 번째 쿼리: ChatTime 기준으로 가장 이른 시간 조회
                    const earliestChatQuery = `
                        SELECT 
                            DATE(ChatTime) AS chatDate, 
                            MIN(ChatTime) AS earliestChatTime
                        FROM 
                            ChatText 
                        WHERE 
                            roomName IN (?)
                        GROUP BY 
                            DATE(ChatTime)
                        ORDER BY 
                            chatDate`;
            
                    // 두 번째 쿼리 실행
                    connection.query(earliestChatQuery, [storeNames], (error, earliestChatResults) => {
                        if (error) {
                            console.error('Earliest ChatTime 조회 오류:', error);
                            return res.status(500).json({ success: false, message: '서버 오류' });
                        }
            
                        // 두 쿼리 결과를 결합하여 응답
                        return res.json({ 
                            success: true, 
                            User_StoreName, 
                            chatResults, 
                            earliestChatResults, 
                            userNames 
                        });
                    });
                });
            })
            
                  .catch(err => {
                      console.error(err);
                      res.status(500).json({ error: 'Error processing user names' });
                  });
          });
      } else {
          return res.json({ success: true, storeNames: [], chatResults: [], userNames: [] }); // 결과가 없을 경우 빈 배열 응답
      }
  });
});



const chatQuery = `
    SELECT 
        DATE(ChatTime) AS chatDate, 
        MIN(ChatTime) AS earliestChatTime
    FROM 
        ChatText 
    WHERE 
        roomName IN (?)
    GROUP BY 
        DATE(ChatTime)
    ORDER BY 
        chatDate`;

// 쿼리 실행
connection.query(chatQuery, ['74394bc5'], (error, chatResults) => {
    if (error) {
        console.error('ChatText 조회 오류:', error);
        return res.status(500).json({ success: false, message: '서버 오류' });
    }
    console.log(chatResults);
    // 응답으로 클라이언트에 storeNames와 chatResults 전송

});


app.post('/UserCheck1', (req, res) => {
  const { usId } = req.body;

  console.log(usId);

  const query = 'SELECT * FROM Wait_regi WHERE Member_Id = ?';
  
  // 쿼리 실행
  connection.query(query, [usId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database query error' });
      }
      
      // 결과 처리
      if (results.length > 0) {
          const { rep_Id, State } = results[0]; // 첫 번째 결과에서 rep_Id와 State를 추출

          // new_table에서 rep_Id로 조회
          const newTableQuery = 'SELECT * FROM new_table WHERE new_tablecol2 = ?';
          connection.query(newTableQuery, [rep_Id], (err, newTableResults) => {
              if (err) {
                  return res.status(500).json({ error: 'Database query error for new_table' });
              }

              // new_table 결과 처리
              if (newTableResults.length > 0) {
                console.log('State:', State); // State 값을 콘솔에 출력

                  const username1 = newTableResults[0].User_Name;
                  const userStoreName1 = newTableResults[0].User_StoreName;
                    // 최종 응답을 여기서 보냅니다.
                res.status(200).json({ 
                  message: 'User exists', 
                  state: State, 
                  userName: username1 , 
                  userStoreName: userStoreName1
              });
              } else {
                  console.log('No matching records found in new_table for rep_Id:', rep_Id);
              }
          });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  });
});

//거절 클릭
app.post('/UserCheck2', (req, res) => {
  const { usId } = req.body;

  console.log('요청된 유저 아이디:', usId);

  // Wait_regi 테이블에서 Member_Id가 usId와 일치하는 값을 조회
  const sql = 'SELECT * FROM Wait_regi WHERE Member_Id = ?';
  connection.query(sql, [usId], (err, results) => {
      if (err) {
          console.error('쿼리 실행 오류:', err);
          return res.status(500).send('서버 오류');
      }

      // 결과를 콘솔에 출력
      console.log('조회된 결과:', results);

      // 결과를 클라이언트에 응답
      res.json(results);
  });
});

// 동의 클릭
app.post('/UserCheck3', (req, res) => {
  const { usId } = req.body;

const updateQuery = `UPDATE \`Wait_regi\` SET \`State\` = 'accept' WHERE \`Member_Id\` = ? AND \`State\` = 'wait'`;

connection.query(updateQuery, [usId], (err, results) => {
    if (err) {
        console.error('업데이트 실패:', err);
        return;
    }
      // Wait_regi 테이블에서 Member_Id가 usId와 일치하는 값을 조회
  const sqlSelect = 'SELECT * FROM Wait_regi WHERE Member_Id = ?';
  connection.query(sqlSelect, [usId], (err, results) => {
      if (err) {
          console.error('쿼리 실행 오류:', err);
          return res.status(500).send('서버 오류');
      }


      if (results.length > 0) {
        const repId = results[0].rep_Id; // rep_Id 값을 변수에 저장
        console.log('조회된 rep_Id:', repId);

        // new_table에서 new_tablecol2 칼럼 값이 usId와 일치하는 값을 조회
        const sqlNewTableSelect = 'SELECT * FROM new_table WHERE new_tablecol2 = ?';
        connection.query(sqlNewTableSelect, [repId], (newTableErr, newTableResults1) => {
            if (newTableErr) {
                console.error('new_table 조회 오류:', newTableErr);
                return res.status(500).send('서버 오류');
            }

            console.log(newTableResults1)
            const userStoreName = newTableResults1[0].User_StoreName; // User_StoreName 값
            const storeCode = newTableResults1[0].Store_Code; // Store_Code 값

      // 결과를 콘솔에 출력
      if (results.length > 0) {
        const repId = results[0].rep_Id; // rep_Id 값을 변수에 저장
        console.log('조회된 rep_Id:', repId);

        // new_table에서 new_tablecol2 칼럼 값이 usId와 일치하는 값을 조회
        const sqlNewTableSelect = 'SELECT * FROM new_table WHERE new_tablecol2 = ?';
        connection.query(sqlNewTableSelect, [usId], (newTableErr, newTableResults) => {
            if (newTableErr) {
                console.error('new_table 조회 오류:', newTableErr);
                return res.status(500).send('서버 오류');
            }

            console.log(newTableResults)
            
               // 조회된 결과가 존재하는지 확인
               if (newTableResults.length > 0) {
  

                // new_table의 값을 업데이트
                const sqlUpdate = 'UPDATE new_table SET User_StoreName = ?, representId = ?, Store_Code = ? WHERE new_tablecol2 = ?';
                connection.query(sqlUpdate, [userStoreName, repId, storeCode, usId], (updateErr, updateResults) => {
                    if (updateErr) {
                        console.error('업데이트 오류:', updateErr);
                        return res.status(500).send('서버 오류');
                    }
                    res.json({ message: '수락이 완료되었습니다.' });
                    console.log('업데이트 성공:', updateResults);
              
                  
const query = `SELECT \`${storeCode}\` FROM \`User_Store_Member_List\``; // 템플릿 리터럴 사용
connection.query(query, (err, results) => {
    if (err) {
        console.error('쿼리 실행 실패:', err);
        return;
    }

    // null 값 체크
    const hasNull = results.some(row => row[storeCode] === null); // 변수 asd 사용

    if (hasNull) {
        // null 값이 있는 경우 업데이트
        const updateQuery = `UPDATE \`User_Store_Member_List\` SET \`${storeCode}\` = ? WHERE \`${storeCode}\` IS NULL LIMIT 1`; // 템플릿 리터럴 사용
        connection.query(updateQuery, [usId], (err, updateResults) => {
            if (err) {
                console.error('업데이트 실패:', err);
                return;
            }
            console.log('null 값을 dsdsdsdad로 업데이트했습니다.');
          
        });
    }
});
                });
            } else {
                res.status(404).send('해당 usId에 대한 결과를 찾을 수 없습니다.');
            }
            
         
        });
    } else {
        res.status(404).send('해당 유저 아이디를 찾을 수 없습니다.');
    }
            
   
        });
    }

    
  });    
    console.log('상태가 wait에서 accept로 변경되었습니다.');
});


 
})

/*
      // 결과가 존재할 경우 State 값을 '수락'으로 업데이트
      if (results.length > 0) {
          const updateSql = 'UPDATE Wait_regi SET State = ? WHERE Member_Id = ?';
          const newState = 'Accepted'; // '수락'을 영어로 변경
          connection.query(updateSql, [newState, usId], (updateErr) => {
              if (updateErr) {
                  console.error('업데이트 오류:', updateErr);
                  return res.status(500).send('서버 오류');
              }

              console.log('State 값이 업데이트되었습니다.');
            
          });
      } else {
          res.status(404).send('해당 유저 아이디를 찾을 수 없습니다.');
      }
      */

app.post('/sendMessage', (req, res) => {
  const { room, UserName, chatText, userID } = req.body;

  // 현재 시간을 KST로 설정
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // KST는 UTC+9시간
  const chatTime = new Date(Date.now() + KR_TIME_DIFF).toISOString().slice(0, 19).replace('T', ' ');

  const storeCodeQuery = `
      SELECT Store_Code, User_StoreName, representId 
      FROM new_table 
      WHERE new_tablecol2 = ?`;

  connection.query(storeCodeQuery, [userID], (error, results) => {
      if (error) {
          console.error('쿼리 실행 오류:', error);
          return res.status(500).json({ success: false, message: '서버 오류' });
      }

      if (results.length > 0) {
          const storeCode = results[0].Store_Code;
          const userStoreName = results[0].User_StoreName;
          const representId = results[0].representId;

          const query = `
              INSERT INTO ChatText (ChatTime, UserId, UserName, ChatText, roomName, StoreName, StoreMaster)
              VALUES (?, ?, ?, ?, ?, ?, ?);
          `;

          connection.query(query, [chatTime, userID, UserName, chatText, storeCode, userStoreName, representId], (error, results) => {
              if (error) {
                  console.error('쿼리 실행 오류:', error);
                  return res.status(500).json({ success: false, message: '서버 오류' });
              }

              return res.json({ success: true, message: '메시지가 성공적으로 처리되었습니다.' });
          });
      } else {
          return res.status(404).json({ success: false, message: 'Store_Code를 찾을 수 없습니다.' });
      }
  });
});


let clients = [];
let dataStore = []; // 데이터 저장소

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 클라이언트를 배열에 추가
    clients.push(res);

    // 클라이언트에게 초기 데이터 전송 (필요한 경우)
    if (dataStore.length > 0) {
        res.write(`data: ${JSON.stringify(dataStore)}\n\n`);
    }

    // 클라이언트 연결 종료 시 정리
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// 데이터 전송 함수
function sendUpdates(data) {
    dataStore.push(data); // 데이터 저장소에 데이터 추가
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`); // 모든 클라이언트에 데이터 전송
    }); 
}


// ✨ express.json 미들웨어 추가! ✨


app.post('/MainCheck', (req, res) => {
  // usId를 req.body에서 가져옵니다.
  const { usMainId } = req.body;

  console.log('asd', usMainId);
  if (!usMainId) {
    console.error('Error: usId parameter is missing in the request body.');
    return res.status(400).send('usId parameter is required in the request body.');
  }

  console.log(`Received usId for search: ${usMainId}`);

  const selectQuery = 'SELECT * FROM new_table WHERE new_tablecol2 = ?';

  connection.query(selectQuery, [usMainId], (queryErr, results) => {
    if (queryErr) {
      console.error('Error executing query:', queryErr);
      return res.status(500).send('Database query error');
    }

    // representId가 usId와 일치하는지 여부를 저장할 플래그
    let isRepresentIdMatching = false;

    if (results.length > 0) {
      console.log(`Matching records found for usId ${usMainId}:`);
      console.log(results);

      // 조회된 결과 중에서 representId와 usId가 일치하는지 확인
      for (const row of results) {
        if (row.representId === usMainId) { // 가정: 데이터베이스에서 가져온 representId 컬럼명이 'representId'
          console.log(`representId 값이 usId와 일치합니다: ${usMainId}`);
          isRepresentIdMatching = true;
          // 첫 번째 일치하는 것을 찾으면 더 이상 확인할 필요 없으므로 break
          break;
        }
      }

      
      // 응답에 isRepresentIdMatching 값을 포함하여 전송
      res.json({ 
        message: 'Records found successfully', 
        data: results,
        isRepresentIdMatching: isRepresentIdMatching // ✨ 이 부분이 추가되었습니다! ✨
      });

    } else {
      console.log(`No matching records found for usId ${usId}.`);
      // 레코드가 없을 때는 당연히 일치하는 값도 없으므로 false를 보냅니다.
      res.status(404).json({ 
        message: 'No records found for the given usId.',
        isRepresentIdMatching: false // ✨ 이 부분이 추가되었습니다! ✨
      });
    }
  });
});



app.post('/NoticeStore', (req, res) => { // async 키워드 제거
  console.log('클라이언트로부터 수신된 데이터 (req.body):', req.body);

  const {
    title,
    content,
    job,
    workingHours,
    storeName,
    hourlyWage,
    employmentType,
    topRegion,
    middleRegion,
    dongRegion
  } = req.body;

  // Day (created_at) 컬럼에 들어갈 현재 날짜와 시간 생성 (서버에서 생성하여 정확성을 보장)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const createdAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // SQL INSERT 쿼리 (컬럼명은 실제 DB 스키마와 정확히 일치시켜주세요)
  const sql = `
    INSERT INTO NoticeBoardCreated (
      title, content, job, workinghours, storename, hourlywage,
      employmenttype, topregion, middleregion, dongregion, Day
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // 쿼리에 들어갈 값들
  const values = [
    title,
    content,
    job,
    workingHours,
    storeName,
    hourlyWage,
    employmentType,
    topRegion,
    middleRegion,
    dongRegion,
    createdAt
  ];

  // connection.query를 사용하여 쿼리 실행 (콜백 방식)
  // try-catch 블록이 없어지며, 에러 핸들링은 콜백 내부에서 진행됩니다.
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('데이터베이스 저장 중 오류 발생:', error);
      // 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
      return res.status(500).json({
        message: '게시글 저장 중 오류가 발생했습니다.',
        error: error.message
      });
    }

    // 쿼리 성공 시, 결과는 `results` 객체에 포함됩니다.
    // INSERT 쿼리의 경우, `results.insertId`에 새로 생성된 ID가 들어있습니다.
    console.log('데이터베이스에 게시글이 성공적으로 추가되었습니다:', results);
    res.status(200).json({
      message: '게시글이 성공적으로 저장되었습니다!',
      insertedId: results.insertId // 새로 삽입된 레코드의 ID (MainCheck 예시와 유사하게 results에서 바로 접근)
    });
  });
});


app.post('/MypageFirst', (req, res) => {

});