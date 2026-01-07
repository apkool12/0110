'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Header from '@/components/Header';
import NavHeader from '@/components/NavHeader';
import { useProgramStore } from '@/store/useProgramStore';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

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

const NameInput = styled.input`
  width: 100%;
  max-width: 350px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 0 20px;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #ccc;
  }
`;

const CreateButton = styled.button`
  width: 100%;
  max-width: 350px;
  height: 50px;
  background-color: #5bc1e6;
  color: #fff;
  border-radius: 25px;
  font-weight: 700;
  font-size: 16px;
  margin-top: 20px;

  &:disabled {
    background-color: #ccc;
  }
`;

export default function CreatePage() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { addProgram, programs } = useProgramStore();

  const handleCreate = () => {
    if (!name.trim()) return;
    
    // addProgram updates the state. We can find the new ID or just rely on the fact it's added.
    addProgram(name.trim());
    
    // Since we want to navigate to the new program, and Date.now() is used for ID,
    // we can either change addProgram to return ID or just navigate to home.
    // For now, let's just go home where the new program will appear.
    router.push('/');
  };

  return (
    <>
      <Header />
      <Container>
        <NavHeader title="새로운 프로그램 만들기" />
        <Content>
          <NameInput 
            placeholder="프로그램 이름을 입력해주세요" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <CreateButton 
            disabled={!name.trim()}
            onClick={handleCreate}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Sparkles size={20} />
            프로그램 생성하기
          </CreateButton>
        </Content>
      </Container>
    </>
  );
}
