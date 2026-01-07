"use client";

import styled from "styled-components";
import {
  Plus,
  SearchX,
  MoreVertical,
  Users,
  Trash2,
  Edit2,
  History,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import { useProgramStore } from "@/store/useProgramStore";
import { useRouter } from "next/navigation";
import { useHasHydrated } from "@/lib/useHasHydrated";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AlertDialog from "@/components/AlertDialog";

const Container = styled.div`
  min-height: calc(100vh - 50px);
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NewProgramButton = styled(motion.button)`
  width: 100%;
  max-width: 350px;
  height: 80px;
  border: 2px dashed #5bc1e6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #fff;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;

const ProgramGrid = styled(motion.div)`
  width: 100%;
  max-width: 350px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding-bottom: 40px;
`;

const ProgramCard = styled(motion.div)`
  width: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #eee;
  position: relative;
`;

const CardThumbnail = styled.div<{ $thumbnailUrl?: string }>`
  width: 100%;
  height: 140px;
  background-image: ${(props) =>
    `url(${
      props.$thumbnailUrl ||
      "https://i.pinimg.com/736x/e0/4d/57/e04d5753cf4baa18baa04f38ff2842ce.jpg"
    })`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5bc1e6;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: #5bc1e6;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(91, 193, 230, 0.15);
`;

const MenuButton = styled.button`
  position: absolute;
  top: 15px;
  right: 10px;
  color: #fff;
  padding: 5px;
  z-index: 10;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 45px;
  right: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
  overflow: hidden;
  z-index: 100;
  min-width: 120px;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.$danger ? "#ff6b6b" : "#333")};
  transition: background 0.2s;
  border-bottom: 1px solid #f5f5f5;
  background: none;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }
  &:active {
    background: #f9f9f9;
  }
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #888;
  font-weight: 600;
  margin-bottom: 6px;
`;

const ProgramTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 15px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #f0f0f0;
  margin-bottom: 15px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Tag = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
`;

const MetaInfo = styled.button`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:active {
    background: #f1f5f9;
    color: #5bc1e6;
  }
`;

const HistoryModal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const HistoryModalContent = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 28px 24px 24px;
  max-width: 360px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseModalButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: background 0.2s;

  &:active {
    background: #e5e5e5;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const HistoryName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const HistoryDate = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
  font-size: 14px;
`;

const EmptyState = styled(motion.div)`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #ccc;
  font-size: 14px;
`;

export default function Home() {
  const { programs, setActiveProgram, deleteProgram } = useProgramStore();
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryProgram, setSelectedHistoryProgram] = useState<
    string | null
  >(null);

  const handleCardClick = (id: string) => {
    if (openMenuId) {
      setOpenMenuId(null);
      return;
    }

    const program = programs.find((p) => p.id === id);

    // 기본 설정 확인: 참가자가 2명 미만이면 알림 표시
    if (!program || program.participants.length < 2) {
      setAlertOpen(true);
      return;
    }

    // 설정이 완료되었으면 입력 페이지로
    setActiveProgram(id);
    router.push(`/program/${id}/input`);
  };

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveProgram(id);
    router.push(`/program/${id}`);
    setOpenMenuId(null);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("이 프로그램을 삭제하시겠습니까?")) {
      deleteProgram(id);
      setOpenMenuId(null);
    }
  };

  const handleHistoryClick = (e: React.MouseEvent, programId: string) => {
    e.stopPropagation();
    setSelectedHistoryProgram(programId);
    setHistoryModalOpen(true);
  };

  const formatHistoryDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  if (!hasHydrated) {
    return (
      <>
        <Header />
        <Container />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container onClick={() => setOpenMenuId(null)}>
        <NewProgramButton
          onClick={() => router.push("/create")}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={24} color="#5bc1e6" strokeWidth={3} />
          <span style={{ color: "#5bc1e6", fontWeight: 700 }}>
            새로운 프로그램 만들기
          </span>
        </NewProgramButton>

        <AnimatePresence>
          {programs.length === 0 ? (
            <EmptyState
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key="empty"
            >
              <SearchX size={48} strokeWidth={1.5} />
              <span>생성된 항목이 없습니다 (｡ﾉω＼｡).</span>
            </EmptyState>
          ) : (
            <ProgramGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="list"
            >
              {programs.map((program) => {
                // 기존 프로그램에 thumbnailUrl이 없으면 랜덤으로 할당 (ID 기반으로 고정)
                const thumbnailImages = [
                  "https://i.pinimg.com/736x/e0/4d/57/e04d5753cf4baa18baa04f38ff2842ce.jpg",
                  "https://i.pinimg.com/236x/18/e8/73/18e873f982ada7f275ecac2003421121.jpg",
                ];
                const thumbnailUrl =
                  program.thumbnailUrl ||
                  thumbnailImages[
                    parseInt(program.id) % thumbnailImages.length
                  ];

                return (
                  <ProgramCard
                    key={program.id}
                    onClick={() => handleCardClick(program.id)}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <CardThumbnail $thumbnailUrl={thumbnailUrl}>
                      <Badge>
                        {program.participants.length}개의 목록 로드됨
                      </Badge>
                      <MenuButton onClick={(e) => toggleMenu(e, program.id)}>
                        <MoreVertical size={24} />
                      </MenuButton>
                      <AnimatePresence>
                        {openMenuId === program.id && (
                          <DropdownMenu
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <MenuItem
                              onClick={(e) => handleEditClick(e, program.id)}
                            >
                              <Edit2 size={16} /> 수정하기
                            </MenuItem>
                            <MenuItem
                              $danger
                              onClick={(e) => handleDelete(e, program.id)}
                            >
                              <Trash2 size={16} /> 삭제하기
                            </MenuItem>
                          </DropdownMenu>
                        )}
                      </AnimatePresence>
                      <Users size={40} opacity={0.2} strokeWidth={1.5} />
                    </CardThumbnail>
                    <CardContent>
                      <Subtitle>정규 항목</Subtitle>
                      <ProgramTitle>{program.name}</ProgramTitle>
                      <Divider />
                      <CardFooter>
                        <Tag>
                          {new Date(program.createdAt).toLocaleDateString()}.
                          생성
                        </Tag>
                        <MetaInfo
                          onClick={(e) => handleHistoryClick(e, program.id)}
                        >
                          <History size={14} />
                          최근 이력
                        </MetaInfo>
                      </CardFooter>
                    </CardContent>
                  </ProgramCard>
                );
              })}
            </ProgramGrid>
          )}
        </AnimatePresence>
      </Container>
      <AlertDialog
        isOpen={alertOpen}
        onClose={() => {
          setAlertOpen(false);
          setSelectedProgramId(null);
        }}
      />

      <AnimatePresence>
        {historyModalOpen && selectedHistoryProgram && (
          <HistoryModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setHistoryModalOpen(false);
              setSelectedHistoryProgram(null);
            }}
          >
            <HistoryModalContent
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  <History size={20} color="#5bc1e6" />
                  최근 10회 이력
                </ModalTitle>
                <CloseModalButton
                  onClick={() => {
                    setHistoryModalOpen(false);
                    setSelectedHistoryProgram(null);
                  }}
                >
                  <X size={20} />
                </CloseModalButton>
              </ModalHeader>
              <HistoryList>
                {(() => {
                  const program = programs.find(
                    (p) => p.id === selectedHistoryProgram
                  );
                  const history = program?.history || [];
                  const recentHistory = history.slice(0, 10);

                  if (recentHistory.length === 0) {
                    return (
                      <EmptyHistory>
                        <SearchX
                          size={32}
                          style={{ margin: "0 auto 12px", opacity: 0.3 }}
                        />
                        <p>아직 추첨 이력이 없습니다.</p>
                      </EmptyHistory>
                    );
                  }

                  return recentHistory.map((item, index) => (
                    <HistoryItem
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <HistoryName>{item.name}</HistoryName>
                      <HistoryDate>
                        {formatHistoryDate(item.drawnAt)}
                      </HistoryDate>
                    </HistoryItem>
                  ));
                })()}
              </HistoryList>
            </HistoryModalContent>
          </HistoryModal>
        )}
      </AnimatePresence>
    </>
  );
}
