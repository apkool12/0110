"use client";

import { use, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import NavHeader from "@/components/NavHeader";
import { useProgramStore } from "@/store/useProgramStore";
import { useHasHydrated } from "@/lib/useHasHydrated";
import { Trash2, Gift, Disc, GitMerge, Settings, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  overflow: hidden;
`;

const InputGroup = styled.div`
  width: 100%;
  max-width: 350px;
  display: flex;
  gap: 10px;
`;

const ParticipantInput = styled.input`
  flex: 1;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 14px;
`;

const AddButton = styled.button`
  padding: 0 10px;
  height: 45px;
  background-color: #5bc1e6;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }
`;

const TabGroup = styled.div`
  width: 100%;
  max-width: 350px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

interface TabButtonProps {
  $active?: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  height: 40px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.$active ? "#5bc1e6" : "#eee")};
  background-color: ${(props) => (props.$active ? "#5bc1e6" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#333")};
`;

const ListContainer = styled.div`
  width: 100%;
  max-width: 350px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fbfcfd;
  border-radius: 20px;
  border: 1px solid #f0f3f5;
  padding: 12px;
  box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.015);
`;

const ParticipantList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
`;

const ParticipantItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
`;

const ParticipantName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FixedBottom = styled.div`
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, #fff 80%, rgba(255, 255, 255, 0));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 50;
`;

const SettingButton = styled(motion.button)`
  width: 100%;
  max-width: 350px;
  height: 64px;
  background-color: #5bc1e6;
  color: #fff;
  border-radius: 18px;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(91, 193, 230, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:disabled {
    background-color: #f1f5f9;
    color: #cbd5e1;
    box-shadow: none;
  }
`;

const SaveInfo = styled.p`
  color: #5bc1e6;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f0f9ff;
  padding: 4px 12px;
  border-radius: 20px;
`;

export default function InputParticipants({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [selectedGame, setSelectedGame] = useState("draw");
  const hasHydrated = useHasHydrated();
  const { programs, addParticipant, removeParticipant } = useProgramStore();

  const program = programs.find((p) => p.id === id);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addParticipant(id, inputValue.trim());
    setInputValue("");
  };

  const handleGameSetting = () => {
    router.push(`/program/${id}/settings?game=${selectedGame}`);
  };

  if (!hasHydrated || !program) return null;

  return (
    <>
      <Header />
      <Container>
        <NavHeader title="추첨 대상 입력" />
        <Content>
          <InputGroup>
            <ParticipantInput
              placeholder="추첨 대상을 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <AddButton
              onClick={handleAdd}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Plus size={18} />
              추가
            </AddButton>
          </InputGroup>

          <TabGroup>
            <TabButton
              $active={selectedGame === "draw"}
              onClick={() => setSelectedGame("draw")}
              style={{ gap: "6px" }}
            >
              <Gift size={16} />
              제비뽑기
            </TabButton>
            <TabButton
              $active={selectedGame === "roulette"}
              onClick={() => setSelectedGame("roulette")}
              style={{ gap: "6px" }}
            >
              <Disc size={16} />
              룰렛
            </TabButton>
            <TabButton
              $active={selectedGame === "ladder"}
              onClick={() => setSelectedGame("ladder")}
              style={{ gap: "6px" }}
            >
              <GitMerge size={16} style={{ transform: "rotate(90deg)" }} />
              사다리타기
            </TabButton>
          </TabGroup>

          <ListContainer>
            <ParticipantList>
              <AnimatePresence initial={false}>
                {program.participants.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#cbd5e1",
                      padding: "60px 0",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    입력된 대상이 없습니다.
                  </div>
                ) : (
                  program.participants.map((p) => (
                    <ParticipantItem
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <ParticipantName>{p.name}</ParticipantName>
                      <DeleteButton onClick={() => removeParticipant(id, p.id)}>
                        <Trash2 size={18} />
                      </DeleteButton>
                    </ParticipantItem>
                  ))
                )}
              </AnimatePresence>
            </ParticipantList>
          </ListContainer>
        </Content>

        <FixedBottom>
          <SaveInfo>
            <GitMerge size={12} style={{ transform: "rotate(90deg)" }} />
            설정이 자동 저장되었습니다.
          </SaveInfo>
          <SettingButton
            disabled={program.participants.length < 2}
            onClick={handleGameSetting}
            whileTap={{ scale: 0.97 }}
          >
            <Settings size={22} />
            {selectedGame === "draw"
              ? "제비뽑기 설정"
              : selectedGame === "roulette"
              ? "룰렛 설정"
              : "사다리타기 설정"}
          </SettingButton>
        </FixedBottom>
      </Container>
    </>
  );
}
