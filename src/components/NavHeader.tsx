'use client';

import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackButtonWrapper = styled.button`
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5bc1e6;
`;

const PageTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #5bc1e6;
`;

const NavContainer = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #fff;
`;

interface NavHeaderProps {
  title: string;
}

export default function NavHeader({ title }: NavHeaderProps) {
  const router = useRouter();
  return (
    <NavContainer>
      <BackButtonWrapper onClick={() => router.back()}>
        <ChevronLeft size={24} />
      </BackButtonWrapper>
      <PageTitle>{title}</PageTitle>
    </NavContainer>
  );
}

