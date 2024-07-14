import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './MemoModal.css';  // 스타일 파일 import
Modal.setAppElement('#root');  // 접근성 설정

const MemoModal = ({ isOpen, onRequestClose, onSave, onDelete, selectedDate, existingMemo }) => {
  const [memo, setMemo] = useState(existingMemo);

  const handleSave = () => {
    onSave(selectedDate, memo);
    onRequestClose(); // 저장 후 모달 닫기
  };

  useEffect(() => {
    setMemo(existingMemo);
  }, [existingMemo]);

  const handleDelete = () => {
    console.log('Delete button clicked'); // 디버깅용 로그
    onDelete(selectedDate, memo);
  };

  if (!isOpen) return null;

  return (
    <Modal
      className='Modal'
      overlayClassName='Overlay'
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Memo Modal"
    >
      <h2>메모 추가 - {selectedDate}</h2>
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows="5"
        cols="50"
      />
      <div>
        <button onClick={handleSave}>저장</button>
        <button onClick={onRequestClose}>취소</button>
        {existingMemo && <button onClick={handleDelete}>삭제</button>}
      </div>
    </Modal>
  );
};

export default MemoModal;