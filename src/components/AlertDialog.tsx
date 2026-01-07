"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Dialog = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 30px 24px 24px;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 12px;
`;

const Message = styled.div`
  font-size: 14px;
  color: #64748b;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const CloseButton = styled(motion.button)`
  width: 100%;
  height: 50px;
  background: #5bc1e6;
  color: white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertDialog({ isOpen, onClose }: AlertDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Dialog
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconCircle>
              <X size={28} color="#ef4444" strokeWidth={3} />
            </IconCircle>
            <Title>설정이 필요합니다.</Title>
            <Message>
              현재 아무런 설정이 이루어지지 않았습니다.
              <br />
              게임 세팅을 마친 후 시작해주세요
            </Message>
            <CloseButton onClick={onClose} whileTap={{ scale: 0.98 }}>
              닫기
            </CloseButton>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

