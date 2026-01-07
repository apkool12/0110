'use client';

import { use, useState } from 'react';

import styled from 'styled-components';
import Header from '@/components/Header';
import NavHeader from '@/components/NavHeader';
import { useProgramStore } from '@/store/useProgramStore';
import { useHasHydrated } from '@/lib/useHasHydrated';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #5bc1e6;
  margin: 10px 0 5px 5px;
`;

const ConfigItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
`;

const ConfigInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const ConfigTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const ConfigDesc = styled.span`
  font-size: 12px;
  color: #888;
`;

const ToggleButton = styled.button`
  color: #5bc1e6;
  margin-left: 10px;
`;

const LadderResultInputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 12px;
`;

const ResultInputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  background: white;
`;

const AddBtn = styled.button`
  width: 40px;
  height: 40px;
  background: #5bc1e6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
`;

const ResultTag = styled.div`
  background: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #444;
  border: 1px solid #eee;
`;

export default function ConfigPageClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const hasHydrated = useHasHydrated();
  const { programs, updateProgramConfig } = useProgramStore();

  const program = programs.find((p) => p.id === id);
  const config = program?.config || { 
    removeAfterDraw: false,
    skipAnimation: false,
    showProbability: true,
    keepHistory: true,
  };

  if (!hasHydrated || !program) return null;

  const toggleConfig = (key: keyof typeof config) => {
    updateProgramConfig(id, { [key]: !config[key] });
  };

  return (
    <>
      <Header />
      <Container>
        <NavHeader title="제외 대상 및 조건 설정" />
        <Content>
          <SectionTitle>일반 설정</SectionTitle>
          <ConfigItem>
            <ConfigInfo>
              <ConfigTitle>뽑힌 항목 제외</ConfigTitle>
              <ConfigDesc>추첨된 항목을 다음 추첨에서 자동으로 제외합니다.</ConfigDesc>
            </ConfigInfo>
            <ToggleButton onClick={() => toggleConfig('removeAfterDraw')}>
              {config.removeAfterDraw ? <ToggleRight size={36} /> : <ToggleLeft size={36} color="#ccc" />}
            </ToggleButton>
          </ConfigItem>

          <ConfigItem>
            <ConfigInfo>
              <ConfigTitle>추첨 애니메이션 생략</ConfigTitle>
              <ConfigDesc>애니메이션 없이 결과를 즉시 확인합니다.</ConfigDesc>
            </ConfigInfo>
            <ToggleButton onClick={() => toggleConfig('skipAnimation')}>
              {config.skipAnimation ? <ToggleRight size={36} /> : <ToggleLeft size={36} color="#ccc" />}
            </ToggleButton>
          </ConfigItem>

          <ConfigItem>
            <ConfigInfo>
              <ConfigTitle>당첨 확률 표시</ConfigTitle>
              <ConfigDesc>상세 설정 화면에서 항목별 당첨 확률(%)을 보여줍니다.</ConfigDesc>
            </ConfigInfo>
            <ToggleButton onClick={() => toggleConfig('showProbability')}>
              {config.showProbability ? <ToggleRight size={36} /> : <ToggleLeft size={36} color="#ccc" />}
            </ToggleButton>
          </ConfigItem>

          <ConfigItem>
            <ConfigInfo>
              <ConfigTitle>추첨 이력 기록</ConfigTitle>
              <ConfigDesc>누가 언제 뽑혔는지 이력을 저장합니다.</ConfigDesc>
            </ConfigInfo>
            <ToggleButton onClick={() => toggleConfig('keepHistory')}>
              {config.keepHistory ? <ToggleRight size={36} /> : <ToggleLeft size={36} color="#ccc" />}
            </ToggleButton>
          </ConfigItem>

          <div style={{ marginTop: '20px', textAlign: 'center', paddingBottom: 40 }}>
            <p style={{ color: '#ccc', fontSize: 12 }}>설정이 자동으로 저장되었습니다.</p>
          </div>
        </Content>
      </Container>
    </>
  );
}
