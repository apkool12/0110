'use client';

import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #5bc1e6;
  font-weight: 400;
  letter-spacing: 2px;
  font-family: 'NeoDunggeunmoPro', sans-serif;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Title>{'> 0110 <'}</Title>
    </HeaderContainer>
  );
}

