import { Layout, Menu, Input, Button } from 'antd';
import 'antd/dist/antd.min.css';
import './MainNoticeBoard.css';
import React, { useState,useEffect  } from 'react'; 
import { MainNab } from './MainPage/MainPage';
//리덕스
import { useSelector } from "react-redux"; // import 해주세요.

const { Header, Sider, Content } = Layout;

function MainNoticeBoard() {
    const [isMenu1Active, setIsMenu1Active] = useState(false);
    const [isMenu2Active, setIsMenu2Active] = useState(false);
    const [isBoardActive, setIsBoardActive] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false); // 새 게시글 추가 후 fetch를 트리거할 상태
    const UserIDtext = useSelector((state) => state.UserID);
    const UsID = UserIDtext.UserID.ID;
    console.log(UserIDtext.UserID.ID)
    // 게시판 상태 추가
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 오류 상태 추가
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedPost, setSelectedPost] = useState(null); // 선택한 게시글
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 10;
    const [boardTitle, setBoardTitle] = useState('게시글 제목'); // 제목 상태 추가

    // 계산기 상태 추가
    const [isCalculatorVisible, setIsCalculatorVisible] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');

    // 게시글 작성 상태 추가
    const [isPostFormVisible, setIsPostFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({});

    const handleShowCalculator = () => {
        setIsMenu1Active(true);
        setIsMenu2Active(false);
        setIsBoardActive(false);
        setIsCalculatorVisible(true);
        setIsPostFormVisible(false); // 게시글 작성 폼 숨기기
        setSelectedPost(null); // 선택한 게시글 초기화
    };

    const handleShowBoard = () => {
        setIsMenu1Active(false);
        setIsMenu2Active(false);
        setIsBoardActive(true);
        setIsCalculatorVisible(false); // 게시판을 선택할 때 계산기 숨김
        setIsPostFormVisible(false); // 게시글 작성 폼 숨기기
        setSelectedPost(null); // 선택한 게시글 초기화
    };

    const handleShowPostForm = () => {
        console.log("작성 중..."); // 게시글 작성 버튼 클릭 시 메시지 출력
        setIsPostFormVisible(true);
        setTitle('');
        setContent('');
    };

    const handlePostSubmit = () => {
        // 서버에 데이터 전송
        fetch('http://localhost:10001/MainNoticeBoardMake', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UsID, // 필요한 UsID 값을 여기에 넣어주세요
                title, // 제목 추가
                content, // 내용 추가
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 형식으로 응답을 파싱
        })
        .then(data => {
            // 응답 데이터 출력
            console.log('서버 응답 데이터:', data);
    
            // 새 게시글을 posts에 추가
            setPosts(prevPosts => [...prevPosts, { title, author: '작성자명', time: new Date().toISOString(), userName: '홍길동', UserID: UsID }]);
    
            setIsPostFormVisible(false); // 게시글 작성 후 폼 숨기기
            setShouldFetch(true); // fetch를 트리거
        })
        .catch(error => {
            // 오류 처리
            console.error('Fetch 오류:', error);
        });
    };
    const handleSelectPost = (index) => {
        const selectedPost = posts[index]; // 선택한 게시글
        setSelectedPost(selectedPost); // 선택한 게시글 설정
    
        // 선택한 게시글의 모든 정보 콘솔에 출력
        console.log('선택한 게시글의 정보:', selectedPost);
    };
    

    const handleDeletePost = (index) => {
        const postToDelete = selectedPost; // 선택된 게시글 정보를 가져옴
        console.log('삭제된 게시글 정보:', postToDelete); // 선택된 게시글 정보 콘솔에 출력
    
        // 서버에 삭제 요청
        fetch('http://localhost:10001/MainNoticeBoardDelete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: postToDelete.title, // 게시글 제목
                author: postToDelete.author, // 게시글 작성자
                time: postToDelete.time, // 게시글 작성 시간
                userName: postToDelete.userName, // 사용자 이름
                UserID: postToDelete.UserID // 사용자 ID
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 형식으로 응답을 파싱
        })
        .then(data => {
            console.log('삭제 응답 데이터:', data); // 서버의 응답 데이터 출력
    
            // 게시글 목록에서 삭제
            setPosts(prevPosts => prevPosts.filter((_, i) => i !== index));
    
            // 삭제된 게시글이 선택된 경우 초기화
            if (selectedPost.index === index) {
                setSelectedPost(null); // 선택 초기화
            }
            setSelectedPost(null); // 선택한 게시글 초기화
        })
        .catch(error => {
            console.error('삭제 요청 오류:', error);
        });
    };
    
    
    
    

    const handleCalculate = () => {
        try {
            const evalResult = eval(inputValue); // eval을 사용할 때는 주의하세요.
            setResult(evalResult);
        } catch (error) {
            setResult('계산 오류');
        }
    };

    const handleBackToList = () => {
        setSelectedPost(null); // 선택한 게시글 초기화
    };

    // 페이지 코드

const handlePrevious = () => {
    if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
    }
};

const handleNext = () => {
    if ((currentPage + 1) * postsPerPage < posts.length) {
        setCurrentPage(currentPage + 1);    
    }
};

const handleEditPost = (post) => {
    const postToDelete = selectedPost; // 선택된 게시글 정보를 가져옴
    console.log('수정할 게시글 정보:', postToDelete); // 선택된 게시글 정보 콘솔에 출력
    setIsEditing(true);
    setEditedPost({ ...post }); // 수정할 게시글의 내용을 상태에 저장
};

// 게시글을 슬라이스할 때 currentPage를 고려
const displayedPosts = posts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

useEffect(() => {
    const fetchData = async () => {
        try {   
            const response = await fetch('http://localhost:10001/MainNoticeBoardLoading', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UsID // 필요한 UsID 값을 여기에 넣어주세요
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // JSON 형식으로 응답을 파싱
            console.log('서버 응답 데이터:', data.noticeBoardData);

            // 게시글 제목을 설정
            if (data.noticeBoardData.length > 0) {
                setBoardTitle(data.noticeBoardData[0].StoreName); // 첫 번째 게시글의 제목
            } else {
                setBoardTitle('게시글이 없습니다.'); // 게시글이 없을 경우 메시지
            }

            // posts 상태 업데이트
            setPosts(data.noticeBoardData.map(item => ({
                title: item.NoticeBoard_Name,
                author: item.NoticeBoard_Text,
                time: item.Create_TIme,
                userName: item.userName,
                UserID : item.User_ID
            })));
        } catch (error) {
            console.error('Fetch 오류:', error);
            setError(error); // 오류 상태 업데이트
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    fetchData(); // 데이터 가져오기 함수 호출
}, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행

useEffect(() => {
    if (shouldFetch) {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:10001/MainNoticeBoardLoading', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        UsID // 필요한 UsID 값을 여기에 넣어주세요
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json(); // JSON 형식으로 응답을 파싱
                console.log('서버 응답 데이터:', data.noticeBoardData); // 응답 데이터 확인

                // posts 상태 업데이트
                setPosts(data.noticeBoardData.map(item => {
                    console.log('각 아이템:', item); // 각 아이템 로그
                    return {
                        title: item.NoticeBoard_Name,
                        author: item.NoticeBoard_Text,
                        time: item.Create_TIme || '시간 정보 없음', // Create_TIme으로 변경
                        userName: item.userName,
                        UserID: item.User_ID // UserID 추가
                    };
                }));
            } catch (error) {
                console.error('Fetch 오류:', error);
                setError(error); // 오류 상태 업데이트
            }
        };

        fetchData(); // 데이터 가져오기 함수 호출
        setShouldFetch(false); // fetch 완료 후 shouldFetch 초기화
    }
}, [shouldFetch]); // shouldFetch가 변경될 때마다 호출


// 로딩 중일 때의 UI
if (loading) {
    return <div>로딩 중...</div>;
}

// 오류가 발생했을 때의 UI
if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
}

const totalPages = Math.ceil(posts.length / postsPerPage); // 총 페이지 수 계산




const handleSaveEdit = () => {
    // 수정된 내용을 서버에 저장하는 로직 추가
    console.log('수정된 게시글:', editedPost);
    
    // 서버에 저장 요청 보내기 로직 추가
    // fetch('서버_URL', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(editedPost)
    // }).then(...);

    setIsEditing(false); // 수정 모드 종료
};

const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedPost(prev => ({ ...prev, [name]: value })); // 수정된 내용 업데이트
};


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <MainNab />
            <Header style={{ background: '#fff', padding: 0 }}>
                <div className="logo">My App</div>
                <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" onClick={handleShowCalculator}>계산기</Menu.Item>
                    <Menu.Item key="2" onClick={handleShowBoard}>게시판</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                        <Menu.Item key="1" onClick={handleShowCalculator}>왼쪽 메뉴 1 - 계산기</Menu.Item>
                        <Menu.Item key="2" onClick={handleShowBoard}>왼쪽 메뉴 2 - 게시판</Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: '#fff',
                            display: 'flex'
                        }}
                    >
                        {isCalculatorVisible && (
                            <div style={{ marginTop: '20px' }}>
                                <h3>계산기</h3>
                                <Input
                                    placeholder="수식 입력 (예: 2+2)"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    style={{ marginBottom: '10px' }}
                                />
                                <Button type="primary" onClick={handleCalculate}>계산하기</Button>
                                <div style={{ marginTop: '10px' }}>
                                    <strong>결과: {result}</strong>
                                </div>
                            </div>
                        )}

                        {isBoardActive && selectedPost === null && (
                            <div style={{ flex: 1, marginRight: '20px' }}>
                                 <h3 id="board-title">게시판</h3>
                                {!isPostFormVisible && ( // 게시글 작성 중이 아닐 때만 버튼 표시
                                    <Button 
                                        type="primary" 
                                        onClick={handleShowPostForm} 
                                        style={{ marginBottom: '20px' }}
                                    >
                                        게시글 만들기
                                    </Button>
                                )}
                                {isPostFormVisible && ( // 게시글 작성 중일 때 리스트 숨기기
                                    <div>
                                        <div style={{ marginBottom: '10px', width: '500px' }}>
                                            <Input
                                                placeholder="제목을 입력하세요"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '10px', width: '500px' }}>
                                            <Input.TextArea
                                                placeholder="내용을 입력하세요"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                style={{ height: '500px' }}
                                            />
                                        </div>
                                        <div>
                                            <Button type="primary" onClick={handlePostSubmit}>저장하기</Button>
                                            <Button 
                                                onClick={() => setIsPostFormVisible(false)} 
                                                style={{ marginLeft: '10px' }}
                                            >
                                                취소하기
                                            </Button>
                                        </div>
                                    </div>
                                )}
                             {!isPostFormVisible && ( // 리스트가 보이도록 조건 추가
    <div style={{ marginTop: '20px', width: '700px' }}>
        {/* 고정된 제목 및 작성자 부분 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'white', background: 'black', padding: '10px', borderRadius: '5px' }}>
            <span>제목</span>
            <span>작성자</span>
        </div>
    </div>
)}

{/* 게시글 리스트 부분 */}
{!isPostFormVisible && (
    <div style={{ marginTop: '1px', background: 'black', padding: '10px', borderRadius: '5px', width: '700px' }}>
        {posts.length === 0 ? (
            <div style={{ color: 'white', textAlign: 'center' }}>
                리스트가 비어있습니다.
            </div>
        ) : (
            <>
                {posts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage).map((post, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            border: '1px solid white', 
                            padding: '10px', 
                            marginBottom: '10px', 
                            cursor: 'pointer', 
                            background: '#333', 
                            color: 'white' 
                        }} 
                        onClick={() => handleSelectPost(index)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>{index + 1 + currentPage * postsPerPage}.</span>
                            <span style={{ 
                                display: 'inline-block', 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                maxWidth: '150px', 
                                color: 'white',
                                fontSize: '1.2em', 
                                fontWeight: 'bold' 
                            }}>
                                {post.userName}
                            </span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexGrow: 1 
                        }}>
                        <span style={{ color: 'white', fontSize: '1em' }}>{post.title}</span>
                        </div>
                        <span style={{ color: 'white', fontSize: '1em', marginLeft: 'auto' }}>{post.time}</span>
                        {/* UserName 추가 */}
                        {/* <span style={{ color: 'white', fontSize: '1em', marginLeft: '10px' }}>{post.author}</span> */}
                    </div>
                ))}

                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <button onClick={handlePrevious} style={{ 
                        marginRight: '10px', 
                        background: 'gray', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        cursor: 'pointer' 
                    }}>
                        이전
                    </button>
                    <button onClick={handleNext} style={{ 
                        marginLeft: '10px', 
                        background: 'gray', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        cursor: 'pointer' 
                    }}>
                        다음
                    </button>
                </div>

                <div style={{ color: 'white', textAlign: 'center', margin: '10px 0' }}>
                    페이지 {currentPage + 1} / {totalPages}
                </div>
            </>
        )}
    </div>
)}
 </div>)}
 {selectedPost && !isEditing && (
    <div style={{ flex: 1 }}>
        <h3>{selectedPost.title}</h3>
        <p>{selectedPost.author}</p>
        <Button type="primary" onClick={handleBackToList} style={{ marginRight: '10px' }}>나가기</Button>
        
        {selectedPost.UserID === UsID && (
            <>
                <Button type="danger" onClick={() => handleDeletePost(posts.indexOf(selectedPost))}>
                    삭제하기
                </Button>
                <Button type="default" onClick={() => handleEditPost(selectedPost)} style={{ marginLeft: '10px' }}>
                    수정하기
                </Button>
            </>
        )}
    </div>
)}

{selectedPost && isEditing && (
    <>
        <Input 
            name="title" 
            value={editedPost.title} 
            onChange={handleInputChange} 
            style={{ marginBottom: '10px' }} 
        />
        <Input 
            name="author" 
            value={editedPost.author} 
            onChange={handleInputChange} 
            style={{ marginBottom: '10px' }} 
        />
        <Button type="primary" onClick={handleSaveEdit}>
            저장하기
        </Button>
        <Button type="default" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
            취소
        </Button>
    </>
)}



                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default MainNoticeBoard;