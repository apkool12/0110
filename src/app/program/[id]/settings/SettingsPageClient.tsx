"use client";

import { use, useState } from "react";

export const dynamicParams = true;
import styled from "styled-components";
import Header from "@/components/Header";
import NavHeader from "@/components/NavHeader";
import { useProgramStore } from "@/store/useProgramStore";
import { useHasHydrated } from "@/lib/useHasHydrated";
import { Trash2, Plus, Info, Play, Users, Gauge } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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
  overflow-y: auto;
  padding-bottom: 100px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingCard = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #333;
`;

const Description = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: -4px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const NumberInput = styled.input`
  width: 80px;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  background: white;
`;

const ToggleSwitch = styled.button<{ $active: boolean }>`
  width: 56px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: ${(props) => (props.$active ? "#5bc1e6" : "#e2e8f0")};
  position: relative;
  transition: background 0.3s;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${(props) => (props.$active ? "27px" : "3px")};
    transition: left 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const SpeedButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SpeedButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.$active ? "#5bc1e6" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#e0f2fe" : "white")};
  color: ${(props) => (props.$active ? "#5bc1e6" : "#64748b")};
  font-size: 14px;
  font-weight: 700;
`;

const LadderResultInputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 16px;
`;

const ResultInputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  background: white;
`;

const AddBtn = styled.button`
  width: 48px;
  height: 48px;
  background: #5bc1e6;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
`;

const ResultTag = styled(motion.div)`
  background: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #444;
  border: 1px solid #eee;
  font-weight: 600;
`;

const InfoBox = styled.div`
  padding: 16px;
  background: #f0f9ff;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #bae6fd;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #0369a1;
  line-height: 1.6;
  flex: 1;
`;

const EmptyStateBox = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const FixedBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #fff 80%, rgba(255, 255, 255, 0));
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 50;
`;

const StartButton = styled(motion.button)`
  width: 100%;
  max-width: 350px;
  height: 60px;
  background-color: #5bc1e6;
  color: #fff;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(91, 193, 230, 0.15);
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

export default function GameSettings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameType = searchParams.get("game") || "draw";
  const hasHydrated = useHasHydrated();
  const {
    programs,
    updateLadderResults,
    updateDrawSettings,
    updateRouletteSettings,
  } = useProgramStore();
  const [newResult, setNewResult] = useState("");

  const program = programs.find((p) => p.id === id);
  const drawSettings = program?.drawSettings || { drawCount: 1, allowDuplicate: false };
  const rouletteSettings = program?.rouletteSettings || { spinSpeed: 'normal' as const, spinDuration: 4 };

  const handleAddLadderResult = () => {
    if (!newResult.trim()) return;
    const current = program?.ladderResults || [];
    updateLadderResults(id, [...current, newResult.trim()]);
    setNewResult("");
  };

  const handleRemoveLadderResult = (index: number) => {
    const current = program?.ladderResults || [];
    updateLadderResults(id, current.filter((_, i) => i !== index));
  };

  const handleDrawCountChange = (value: number) => {
    const maxCount = program?.participants.length || 1;
    const newCount = Math.max(1, Math.min(value, maxCount));
    updateDrawSettings(id, { drawCount: newCount });
  };

  const handleStartGame = () => {
    router.push(`/program/${id}/game?type=${gameType}`);
  };

  const isLadderConfigured =
    gameType !== "ladder" ||
    (program?.ladderResults && program.ladderResults.length >= (program?.participants.length || 0));

  if (!hasHydrated || !program) return null;

  return (
    <>
      <Header />
      <Container>
        <NavHeader
          title={
            gameType === "draw"
              ? "제비뽑기 설정"
              : gameType === "roulette"
              ? "룰렛 설정"
              : "사다리타기 설정"
          }
        />
        <Content>
          {gameType === "draw" && (
            <SettingCard>
              <SectionTitle>
                <Users size={18} />
                추첨 설정
              </SectionTitle>
              <SettingItem>
                <Label>뽑을 개수</Label>
                <Description>
                  한 번에 몇 명을 뽑을지 설정합니다. (최대 {program.participants.length}명)
                </Description>
                <InputGroup>
                  <NumberInput
                    type="number"
                    min={1}
                    max={program.participants.length}
                    value={drawSettings.drawCount}
                    onChange={(e) =>
                      handleDrawCountChange(parseInt(e.target.value) || 1)
                    }
                  />
                  <span style={{ fontSize: 14, color: "#666" }}>명</span>
                </InputGroup>
              </SettingItem>
              <SettingItem>
                <Label>중복 허용</Label>
                <Description>
                  같은 사람을 여러 번 뽑을 수 있도록 설정합니다.
                </Description>
                <ToggleSwitch
                  $active={drawSettings.allowDuplicate}
                  onClick={() =>
                    updateDrawSettings(id, {
                      allowDuplicate: !drawSettings.allowDuplicate,
                    })
                  }
                />
              </SettingItem>
            </SettingCard>
          )}

          {gameType === "roulette" && (
            <SettingCard>
              <SectionTitle>
                <Gauge size={18} />
                회전 설정
              </SectionTitle>
              <SettingItem>
                <Label>회전 속도</Label>
                <Description>
                  룰렛이 회전하는 속도를 설정합니다.
                </Description>
                <SpeedButtonGroup>
                  <SpeedButton
                    $active={rouletteSettings.spinSpeed === "slow"}
                    onClick={() =>
                      updateRouletteSettings(id, {
                        spinSpeed: "slow",
                        spinDuration: 5,
                      })
                    }
                  >
                    느림
                  </SpeedButton>
                  <SpeedButton
                    $active={rouletteSettings.spinSpeed === "normal"}
                    onClick={() =>
                      updateRouletteSettings(id, {
                        spinSpeed: "normal",
                        spinDuration: 4,
                      })
                    }
                  >
                    보통
                  </SpeedButton>
                  <SpeedButton
                    $active={rouletteSettings.spinSpeed === "fast"}
                    onClick={() =>
                      updateRouletteSettings(id, {
                        spinSpeed: "fast",
                        spinDuration: 3,
                      })
                    }
                  >
                    빠름
                  </SpeedButton>
                </SpeedButtonGroup>
              </SettingItem>
              <InfoBox>
                <Info size={18} color="#0369a1" />
                <InfoText>
                  회전 속도가 빠를수록 게임이 더 빠르게 진행됩니다.
                </InfoText>
              </InfoBox>
            </SettingCard>
          )}

          {gameType === "ladder" && (
            <>
              <SectionTitle>사다리타기 목적지 설정</SectionTitle>
              <LadderResultInputArea>
                <ResultInputGroup>
                  <Input
                    placeholder="목적지 이름 (예: 당첨, 꽝, 벌칙...)"
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddLadderResult()}
                  />
                  <AddBtn onClick={handleAddLadderResult}>
                    <Plus size={20} />
                  </AddBtn>
                </ResultInputGroup>
                <ResultTagList>
                  {(program.ladderResults || []).length === 0 ? (
                    <EmptyStateBox>
                      <Info size={20} style={{ margin: "0 auto 10px" }} />
                      <p>등록된 목적지가 없습니다.</p>
                      <p style={{ fontSize: 12, marginTop: 4 }}>
                        기본값으로 "탈락"이 사용됩니다.
                      </p>
                    </EmptyStateBox>
                  ) : (
                    (program.ladderResults || []).map((res, i) => (
                      <ResultTag
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        {res}
                        <Trash2
                          size={14}
                          color="#ff6b6b"
                          onClick={() => handleRemoveLadderResult(i)}
                          style={{ cursor: "pointer" }}
                        />
                      </ResultTag>
                    ))
                  )}
                </ResultTagList>
              </LadderResultInputArea>
              <InfoBox>
                <Info size={18} color="#0369a1" />
                <InfoText>
                  참가자 수({program.participants.length}명)만큼 목적지를 설정하는 것을 권장합니다.
                  목적지 수가 부족하면 기본값("탈락")이 자동으로 추가됩니다.
                </InfoText>
              </InfoBox>
            </>
          )}
        </Content>

        <FixedBottom>
          <StartButton
            disabled={
              program.participants.length < 2 ||
              (gameType === "ladder" && !isLadderConfigured)
            }
            onClick={handleStartGame}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={22} fill="white" />
            게임 시작
          </StartButton>
        </FixedBottom>
      </Container>
    </>
  );
}
