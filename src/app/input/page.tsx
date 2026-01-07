"use client";

import { useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import NavHeader from "@/components/NavHeader";

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
  gap: 20px;
  align-items: center;
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
  padding: 0 20px;
  height: 45px;
  background-color: #5bc1e6;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;

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

export default function InputParticipants() {
  const [inputValue, setInputValue] = useState("");
  const [selectedGame, setSelectedGame] = useState("draw");

  return (
    <>
      <Header />
      <Container>
        <NavHeader title="추첨 대상 입력" />
        <Content>
          <InputGroup>
            <ParticipantInput
              placeholder=""
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <AddButton>추가</AddButton>
          </InputGroup>

          <TabGroup>
            <TabButton
              $active={selectedGame === "draw"}
              onClick={() => setSelectedGame("draw")}
            >
              제비뽑기
            </TabButton>
            <TabButton
              $active={selectedGame === "roulette"}
              onClick={() => setSelectedGame("roulette")}
            >
              룰렛
            </TabButton>
            <TabButton
              $active={selectedGame === "ladder"}
              onClick={() => setSelectedGame("ladder")}
            >
              사다리타기
            </TabButton>
          </TabGroup>

          {/* List of added participants would go here */}
        </Content>
      </Container>
    </>
  );
}
