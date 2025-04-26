import React from 'react';
import { Modal } from 'flowbite-react';
import Comments from './Comments';

const CommentModal = ({ isOpen, onClose, postId, userId }) => {
  return (
    <Modal 
      show={isOpen}
      onClose={onClose}
      size="lg"
      popup
      dismissible
    >
      <Modal.Body className="p-4 h-[80vh]">
        <Comments postId={postId} userId={userId} onClose={onClose} />
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;