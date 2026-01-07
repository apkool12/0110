"use client";

import { use, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styled, { keyframes, css } from "styled-components";
import Header from "@/components/Header";
import NavHeader from "@/components/NavHeader";
import { useProgramStore } from "@/store/useProgramStore";
import { useHasHydrated } from "@/lib/useHasHydrated";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import LadderGame from "@/components/LadderGame";
import { Gift, Lightbulb, Trophy, List, X } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  margin: 30px 0;
  padding: 10px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
  padding-bottom: 100px;
`;

const GameContainer = styled.div`
  width: 100%;
  max-width: 380px;
  aspect-ratio: 0.85;
  background: radial-gradient(circle at center, #fdfdfd 0%, #f5faff 100%);
  border-radius: 30px;
  box-shadow: 0 4px 16px rgba(91, 193, 230, 0.08);
  border: 1px solid rgba(91, 193, 230, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// --- Roulette Components ---
const RouletteWrapper = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RouletteArrow = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #5bc1e6;
  z-index: 10;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
`;

const CenterCircle = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  z-index: 5;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #5bc1e6;

  &::after {
    content: "";
    width: 6px;
    height: 6px;
    background: #5bc1e6;
    border-radius: 50%;
  }
`;

// --- Draw(Gift) Components ---
const spin = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1) rotate(0deg); }
  75% { transform: scale(1.1) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const BoxWrapper = styled(motion.div)<{ $isSpinning: boolean }>`
  color: #5bc1e6;
  ${(props) =>
    props.$isSpinning &&
    css`
      animation: ${spin} 0.4s infinite linear;
    `}
`;

// --- Result Modal ---
const ResultOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

const ResultTag = styled.span`
  background: #5bc1e6;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 15px;
`;

const WinnerName = styled(motion.h2)`
  font-size: 36px;
  font-weight: 900;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  word-break: break-all;
  line-height: 1.1;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  height: 64px;
  background-color: #5bc1e6;
  color: #fff;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(91, 193, 230, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:disabled {
    background-color: #ccc;
    box-shadow: none;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  color: #999;
  font-size: 15px;
  font-weight: 600;
  text-decoration: underline;
`;

const AllResultsButton = styled(motion.button)`
  width: 100%;
  max-width: 320px;
  height: 56px;
  background-color: #f8f9fa;
  color: #333;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  z-index: 10;
  position: relative;
`;

const AllResultsOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const AllResultsModal = styled(motion.div)`
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

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResultItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background: #f8f9fa;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
`;

const ParticipantName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const ResultArrow = styled.span`
  font-size: 14px;
  color: #94a3b8;
  margin: 0 12px;
`;

const ResultLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #5bc1e6;
  padding: 6px 14px;
  background: #e0f2fe;
  border-radius: 12px;
`;

// --- Roulette SVG with Text Labels ---
const RouletteWheel = ({
  participants,
  rotation,
  spinDuration = 4,
}: {
  participants: any[];
  rotation: number;
  spinDuration?: number;
}) => {
  const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);
  let currentAngle = 0;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      style={{ width: "100%", height: "100%" }}
      animate={{ rotate: rotation }}
      transition={{ duration: spinDuration, ease: [0.2, 0.8, 0.2, 1] }} // 부드러운 감속 효과
    >
      <defs>
        {participants.map((p, i) => (
          <path
            key={`path-def-${p.id}`}
            id={`path-${i}`}
            d={`M 50 50 L ${
              50 +
              40 *
                Math.cos(
                  ((currentAngle + ((p.weight / totalWeight) * 360) / 2) *
                    Math.PI) /
                    180
                )
            } ${
              50 +
              40 *
                Math.sin(
                  ((currentAngle + ((p.weight / totalWeight) * 360) / 2) *
                    Math.PI) /
                    180
                )
            }`}
          />
        ))}
      </defs>

      {participants.map((p, i) => {
        const angle = (p.weight / totalWeight) * 360;
        const x1 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180);
        const y1 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180);
        const x2 = 50 + 50 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
        const y2 = 50 + 50 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
        const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${
          angle > 180 ? 1 : 0
        } 1 ${x2} ${y2} Z`;
        const color = `hsl(${(i * 137.5) % 360}, 75%, 75%)`;

        const labelAngle = currentAngle + angle / 2;
        const textX = 50 + 30 * Math.cos((labelAngle * Math.PI) / 180);
        const textY = 50 + 30 * Math.sin((labelAngle * Math.PI) / 180);

        currentAngle += angle;

        return (
          <g key={p.id}>
            <path d={d} fill={color} stroke="white" strokeWidth="0.5" />
            <text
              x={textX}
              y={textY}
              fill="white"
              fontSize="4"
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${labelAngle + 90}, ${textX}, ${textY})`}
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
            >
              {p.name.length > 5 ? p.name.substring(0, 4) + ".." : p.name}
            </text>
          </g>
        );
      })}
    </motion.svg>
  );
};

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameType = searchParams.get("type") || "draw";
  const hasHydrated = useHasHydrated();
  const { programs, removeParticipant, addHistory } = useProgramStore();

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [allLadderResults, setAllLadderResults] = useState<
    Array<{ participantName: string; resultLabel: string }>
  >([]);
  const [showAllResults, setShowAllResults] = useState(false);

  const program = programs.find((p) => p.id === id);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#5bc1e6", "#ff6b6b", "#333333"],
    });
  };

  const drawResult = () => {
    if (!program || program.participants.length < 1) return;

    setIsSpinning(true);
    setResult(null);

    const drawSettings = program.drawSettings || {
      drawCount: 1,
      allowDuplicate: false,
    };
    const drawCount = gameType === "draw" ? drawSettings.drawCount : 1;
    const allowDuplicate =
      gameType === "draw" ? drawSettings.allowDuplicate : false;

    // 가중치 기반 추첨 로직 (여러 명 뽑기 지원)
    const availableParticipants = [...program.participants];
    const selectedParticipants: typeof program.participants = [];

    for (
      let draw = 0;
      draw < drawCount && availableParticipants.length > 0;
      draw++
    ) {
      const totalWeight = availableParticipants.reduce(
        (sum, p) => sum + p.weight,
        0
      );
      let random = Math.random() * totalWeight;
      let accumulatedWeight = 0;
      let selectedIndex = 0;

      for (let i = 0; i < availableParticipants.length; i++) {
        accumulatedWeight += availableParticipants[i].weight;
        if (random < accumulatedWeight) {
          selectedIndex = i;
          break;
        }
      }

      const selected = availableParticipants[selectedIndex];
      selectedParticipants.push(selected);

      // 중복 허용하지 않으면 이미 뽑은 참가자 제거
      if (!allowDuplicate) {
        availableParticipants.splice(selectedIndex, 1);
      }
    }

    const selectedParticipant = selectedParticipants[0];
    const resultText =
      selectedParticipants.length > 1
        ? selectedParticipants.map((p) => p.name).join(", ")
        : selectedParticipant.name;

    // 룰렛 회전 각도 계산
    if (gameType === "roulette") {
      const rouletteSettings = program.rouletteSettings || {
        spinSpeed: "normal",
        spinDuration: 4,
      };
      const totalWeightForRoulette = program.participants.reduce(
        (sum, p) => sum + p.weight,
        0
      );
      const selectedIndexForRoulette = program.participants.findIndex(
        (p) => p.id === selectedParticipant.id
      );

      let currentAccWeight = 0;
      for (let i = 0; i < selectedIndexForRoulette; i++) {
        currentAccWeight += program.participants[i].weight;
      }
      const participantAngle =
        (program.participants[selectedIndexForRoulette].weight /
          totalWeightForRoulette) *
        360;
      const centerOfSegment =
        (currentAccWeight / totalWeightForRoulette) * 360 +
        participantAngle / 2;

      const newRotation = rotation + (3600 + (270 - centerOfSegment));
      setRotation(newRotation);
    }

    const showResult = () => {
      setIsSpinning(false);
      setResult(resultText);
      triggerConfetti();

      if (program.config?.keepHistory) {
        selectedParticipants.forEach((p) => addHistory(id, p.name));
      }

      if (program.config?.removeAfterDraw) {
        selectedParticipants.forEach((p) => removeParticipant(id, p.id));
      }
    };

    if (program.config?.skipAnimation) {
      showResult();
    } else {
      const rouletteSettings = program.rouletteSettings || {
        spinSpeed: "normal",
        spinDuration: 4,
      };
      const duration =
        gameType === "roulette" ? rouletteSettings.spinDuration * 1000 : 2000;
      setTimeout(showResult, duration);
    }
  };

  if (!hasHydrated || !program) return null;

  return (
    <>
      <Header />
      <Container>
        <NavHeader
          title={
            gameType === "draw"
              ? "제비뽑기"
              : gameType === "roulette"
              ? "룰렛"
              : "사다리타기"
          }
        />
        <Content>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "#333",
                marginBottom: "4px",
              }}
            >
              {gameType === "ladder" && (
                <Lightbulb size={18} color="#5bc1e6" strokeWidth={2.5} />
              )}
              <p style={{ fontSize: 16, fontWeight: 700 }}>
                {gameType === "ladder"
                  ? "상단 이름을 눌러 사다리를 타보세요!"
                  : `남은 대상: ${program.participants.length}명`}
              </p>
            </div>
            {gameType !== "ladder" && (
              <p style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
                비중에 따라 확률이 자동으로 계산됩니다.
              </p>
            )}
          </div>

          <GameContainer>
            {gameType === "roulette" && (
              <RouletteWrapper>
                <RouletteArrow />
                <RouletteWheel
                  participants={program.participants}
                  rotation={rotation}
                  spinDuration={program.rouletteSettings?.spinDuration || 4}
                />
                <CenterCircle />
              </RouletteWrapper>
            )}

            {gameType === "draw" && (
              <BoxWrapper
                $isSpinning={isSpinning}
                animate={isSpinning ? { y: [0, -20, 0] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Gift size={100} strokeWidth={1.5} />
              </BoxWrapper>
            )}

            {gameType === "ladder" && (
              <LadderGame
                participants={program.participants}
                customResults={program.ladderResults || []}
                onFinish={(participantName, resultLabel) => {
                  // 사다리타기 완료 후 자동으로 결과를 표시하지 않음
                  if (program.config?.keepHistory)
                    addHistory(id, `${participantName}: ${resultLabel}`);
                }}
                onAllResults={(results) => {
                  setAllLadderResults(results);
                }}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            )}

            <AnimatePresence>
              {result && (
                <ResultOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResultTag
                    style={{
                      backgroundColor: "#333",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Trophy size={14} />
                    추첨 결과
                  </ResultTag>
                  <WinnerName
                    initial={{ scale: 0.5, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    {result}
                  </WinnerName>
                  <ActionButton
                    whileTap={{ scale: 0.95 }}
                    style={{ backgroundColor: "#333" }}
                    onClick={() => {
                      setResult(null);
                      if (program.participants.length < 1) router.back();
                    }}
                  >
                    확인
                  </ActionButton>
                  <CloseButton onClick={() => router.back()}>
                    그만하기
                  </CloseButton>
                </ResultOverlay>
              )}
            </AnimatePresence>
          </GameContainer>

          {gameType !== "ladder" && (
            <ActionButton
              onClick={drawResult}
              disabled={isSpinning || program.participants.length < 1}
              whileTap={{ scale: 0.95 }}
            >
              {isSpinning ? "추첨 중..." : "추첨 시작!"}
            </ActionButton>
          )}

          {gameType === "ladder" && allLadderResults.length > 0 && (
            <AllResultsButton
              onClick={() => setShowAllResults(true)}
              whileTap={{ scale: 0.98 }}
            >
              <List size={20} />
              전체 결과 보기
            </AllResultsButton>
          )}
        </Content>
      </Container>

      <AnimatePresence>
        {showAllResults && (
          <AllResultsOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllResults(false)}
          >
            <AllResultsModal
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  <Trophy size={20} color="#5bc1e6" />
                  전체 결과
                </ModalTitle>
                <CloseModalButton onClick={() => setShowAllResults(false)}>
                  <X size={20} />
                </CloseModalButton>
              </ModalHeader>
              <ResultsList>
                {allLadderResults.map((item, index) => (
                  <ResultItem
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ParticipantName>{item.participantName}</ParticipantName>
                    <ResultArrow>→</ResultArrow>
                    <ResultLabel>{item.resultLabel}</ResultLabel>
                  </ResultItem>
                ))}
              </ResultsList>
            </AllResultsModal>
          </AllResultsOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
