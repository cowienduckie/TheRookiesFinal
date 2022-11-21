import { useState } from 'react';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';

export function CustomModal(props) {
  const { buttonText, modalTitle, path, location, onClick, onClose } = props;

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOnClick = () => {
    onClick();

    setOpen(true);
  }

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      onClose();

      setOpen(false);

      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    onClose();

    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={handleOnClick}>
        {buttonText}
      </Button>

      <Modal
        title={modalTitle}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        background={{ location }}
      >
        {props.children}
      </Modal>
    </>
  );
}