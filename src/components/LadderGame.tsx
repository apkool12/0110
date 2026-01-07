'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 0;
  z-index: 5;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  position: relative;
  background-color: #fff;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const TopLabels = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background: #fff;
  border-bottom: 1px solid #eee;
`;

const BottomLabels = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background: #fff;
  border-top: 1px solid #eee;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 65px;
`;

const Label = styled.div<{ $active?: boolean; $color?: string }>`
  font-size: 13px;
  font-weight: 800;
  color: ${props => props.$active ? '#fff' : '#444'};
  background: ${props => props.$active ? (props.$color || '#5bc1e6') : '#f0f2f5'};
  padding: 8px 6px;
  border-radius: 8px;
  transition: all 0.2s;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
`;

const ResultBadge = styled.div<{ $color?: string }>`
  font-size: 11px;
  font-weight: 700;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${props => props.$color ? `${props.$color}20` : '#f8f9fa'};
  border: 1px solid ${props => props.$color ? `${props.$color}40` : '#e2e8f0'};
  white-space: nowrap;
`;

const ResultLabel = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #333;
  padding: 8px 6px;
  text-align: center;
  width: 65px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
`;

interface LadderGameProps {
  participants: { id: string; name: string }[];
  customResults: string[];
  onFinish: (winnerName: string, resultLabel: string) => void;
  onAllResults?: (results: Array<{ participantName: string; resultLabel: string }>) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

export default function LadderGame({ participants, customResults, onFinish, onAllResults, isSpinning, setIsSpinning }: LadderGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [displayResults, setDisplayResults] = useState<string[]>([]);
  const [allResults, setAllResults] = useState<Array<{ participantName: string; resultLabel: string }>>([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isInstant, setIsInstant] = useState(false);
  
  const animationRef = useRef<number>(null);
  const onAllResultsRef = useRef(onAllResults);
  const setIsSpinningRef = useRef(setIsSpinning);
  const onFinishRef = useRef(onFinish);
  
  // ref 업데이트
  useEffect(() => {
    onAllResultsRef.current = onAllResults;
    setIsSpinningRef.current = setIsSpinning;
    onFinishRef.current = onFinish;
  }, [onAllResults, setIsSpinning, onFinish]);
  
  const count = participants.length;
  const colors = useMemo(() => participants.map((_, i) => `hsl(${(i * 137.5) % 360}, 75%, 55%)`), [count]);
  const ROWS = 25;

  const memoizedResultsKey = JSON.stringify(customResults);
  const participantsKey = useMemo(() => {
    return JSON.stringify(participants.map(p => ({ id: p.id, name: p.name })));
  }, [participants]);
  
  useEffect(() => {
    if (count < 2) return;

    const newPaths: any[] = [];
    const horizontalRungs: { r: number, c: number }[] = [];
    const diagonalRungs: { r: number, c: number, dir: number }[] = [];

    // 사다리 구조 설계 (수평선과 대각선을 적절히 섞음)
    // 컬럼 순서를 섞어서 더 균등하게 분포
    const shuffledCols = Array.from({ length: count - 1 }, (_, i) => i).sort(() => Math.random() - 0.5);
    
    for (let r = 1; r < ROWS; r++) {
      // 각 행마다 컬럼 순서를 섞어서 더 복잡하게
      const rowCols = [...shuffledCols].sort(() => Math.random() - 0.5);
      
      for (const c of rowCols) {
        const rand = Math.random();
        
        // 인접한 칸에 이미 선이 있는지 확인하여 꼬임 방지
        const hasLeft = horizontalRungs.some(h => h.r === r && h.c === c - 1) || diagonalRungs.some(d => d.r === r && d.c === c - 1);
        const hasRight = horizontalRungs.some(h => h.r === r && h.c === c + 1) || diagonalRungs.some(d => d.r === r && d.c === c + 1);
        const hasDiagonalConflict = diagonalRungs.some(d => d.r === r && d.c === c + 1 && d.dir === -1);
        const hasLeftDiagonalConflict = diagonalRungs.some(d => d.r === r && d.c === c - 1 && d.dir === 1);

        if (!hasLeft && !hasRight && !hasDiagonalConflict && !hasLeftDiagonalConflict) {
          if (rand > 0.55) {
            // 45% 확률로 수평선 (더 많이 생성)
            horizontalRungs.push({ r, c });
          } else if (rand > 0.25) {
            // 30% 확률로 대각선 (더 많이 생성)
            const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
            // 경계 체크
            if ((dir === 1 && c < count - 1) || (dir === -1 && c > 0)) {
              diagonalRungs.push({ r, c, dir });
            }
          }
        }
      }
    }

    // 각 참가자별 경로 계산
    for (let i = 0; i < count; i++) {
      const segments: any[] = [];
      let currentCol = i;
      
      for (let r = 1; r <= ROWS; r++) {
        // 1. 수직으로 해당 층까지 내려옴
        const prevY = r - 1;
        const currY = r;

        // 현재 층에서 분기점 확인
        const hRight = horizontalRungs.find(h => h.r === r && h.c === currentCol);
        const hLeft = horizontalRungs.find(h => h.r === r && h.c === currentCol - 1);
        const dRight = diagonalRungs.find(d => d.r === r && d.c === currentCol && d.dir === 1);
        const dLeft = diagonalRungs.find(d => d.r === r && d.c === currentCol - 1 && d.dir === -1);

        if (dRight) {
          // 대각선 이동
          const dir = dRight.dir;
          segments.push({ from: { x: currentCol, y: prevY }, to: { x: currentCol + dir, y: currY }, length: 1.414, type: 'd' });
          currentCol += dir;
        } else if (dLeft) {
          // 대각선 좌측 이동
          const dir = dLeft.dir;
          segments.push({ from: { x: currentCol, y: prevY }, to: { x: currentCol + dir, y: currY }, length: 1.414, type: 'd' });
          currentCol += dir;
        } else {
          // 일반 수직 이동 후 수평선 체크
          segments.push({ from: { x: currentCol, y: prevY }, to: { x: currentCol, y: currY }, length: 1, type: 'v' });
          
          if (hRight) {
            segments.push({ from: { x: currentCol, y: currY }, to: { x: currentCol + 1, y: currY }, length: 1, type: 'h' });
            currentCol++;
          } else if (hLeft) {
            segments.push({ from: { x: currentCol, y: currY }, to: { x: currentCol - 1, y: currY }, length: 1, type: 'h' });
            currentCol--;
          }
        }
      }
      newPaths.push({ startCol: i, endCol: currentCol, segments, totalLength: segments.reduce((acc, s) => acc + s.length, 0) });
    }

    setPaths(newPaths);

    let finalResults = [...customResults];
    if (finalResults.length < count) {
      const defaultRes = Array(count - finalResults.length).fill('탈락');
      finalResults = [...finalResults, ...defaultRes];
    }
    const shuffledResults = finalResults.slice(0, count).sort(() => Math.random() - 0.5);
    setDisplayResults(shuffledResults);
    
    // 모든 참가자의 결과 계산
    const computedResults = newPaths.map((path, idx) => ({
      participantName: participants[idx].name,
      resultLabel: shuffledResults[path.endCol],
    }));
    setAllResults(computedResults);
    
    // 전체 결과 콜백 호출 (ref를 통해 최신 함수 호출)
    if (onAllResultsRef.current) {
      onAllResultsRef.current(computedResults);
    }
    
    setActiveIndex(null);
    setAnimationProgress(0);
  }, [count, memoizedResultsKey, participantsKey]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || paths.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = 35;
    const usableWidth = rect.width - padding * 2;
    const colWidth = usableWidth / (count - 1);
    const rowHeight = rect.height / ROWS;

    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // 사다리 기본 틀 (연한 가이드라인)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 배경 선 그리기
    paths.forEach(p => {
      ctx.strokeStyle = '#f5f5f5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(padding + p.segments[0].from.x * colWidth, p.segments[0].from.y * rowHeight);
      p.segments.forEach((seg: any) => {
        ctx.lineTo(padding + seg.to.x * colWidth, seg.to.y * rowHeight);
      });
      ctx.stroke();
    });

    // 기둥 세로 가이드라인
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.moveTo(padding + i * colWidth, 0);
      ctx.lineTo(padding + i * colWidth, rect.height);
      ctx.stroke();
    }

    // 활성화된 경로 (강조 애니메이션)
    if (activeIndex !== null) {
      const p = paths[activeIndex];
      ctx.strokeStyle = colors[activeIndex];
      ctx.lineWidth = 5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors[activeIndex];
      
      let currentProgress = isInstant ? p.totalLength : animationProgress;
      let drawnLength = 0;

      ctx.beginPath();
      ctx.moveTo(padding + p.segments[0].from.x * colWidth, p.segments[0].from.y * rowHeight);

      for (const seg of p.segments) {
        const remaining = currentProgress - drawnLength;
        if (remaining <= 0) break;

        const drawLen = Math.min(seg.length, remaining);
        const ratio = drawLen / seg.length;

        const endX = seg.from.x + (seg.to.x - seg.from.x) * ratio;
        const endY = seg.from.y + (seg.to.y - seg.from.y) * ratio;

        ctx.lineTo(padding + endX * colWidth, endY * rowHeight);
        drawnLength += drawLen;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [paths, activeIndex, animationProgress, isInstant, count, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [count]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (activeIndex !== null && isSpinning) {
      const p = paths[activeIndex];
      
      if (isInstant) {
        setAnimationProgress(p.totalLength);
        // 상태 업데이트를 다음 프레임으로 지연
        requestAnimationFrame(() => {
          setIsSpinningRef.current(false);
        });
        // 사다리타기 완료 후 결과를 자동으로 표시하지 않음
        return;
      }

      const speed = 0.05; 
      const animate = () => {
        setAnimationProgress(prev => {
          if (prev >= p.totalLength) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            // 상태 업데이트를 다음 프레임으로 지연
            requestAnimationFrame(() => {
              setIsSpinningRef.current(false);
            });
            // 사다리타기 완료 후 결과를 자동으로 표시하지 않음
            return p.totalLength;
          }
          return prev + speed;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeIndex, isInstant, isSpinning, paths.length, displayResults.length, count]);

  const handleLabelClick = (index: number) => {
    if (activeIndex === index && isSpinning) {
      setIsInstant(true);
      return;
    }
    if (isSpinning) return;
    setActiveIndex(index);
    setAnimationProgress(0);
    setIsInstant(false);
    setIsSpinning(true);
  };

  return (
    <Container>
      <TopLabels>
        {participants.map((p, i) => (
          <LabelWrapper key={p.id}>
            <Label onClick={() => handleLabelClick(i)} $active={activeIndex === i} $color={colors[i]}>
              {p.name}
            </Label>
          </LabelWrapper>
        ))}
      </TopLabels>
      <CanvasWrapper>
        <Canvas ref={canvasRef} />
      </CanvasWrapper>
      <BottomLabels>
        {displayResults.map((res, i) => (
          <ResultLabel key={i}>{res}</ResultLabel>
        ))}
      </BottomLabels>
    </Container>
  );
}
