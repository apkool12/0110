import ProgramDetailClient from "./ProgramDetailClient";

export function generateStaticParams() {
  return [];
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
`;

const Content = styled.div`
  padding: 10px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const NameInputContainer = styled.div`
  width: 100%;
  max-width: 350px;
  position: relative;
  display: flex;
  align-items: center;
`;

const NameInput = styled.input`
  width: 100%;
  height: 50px;
  border: 1px solid ${(props) => (props.readOnly ? "#ddd" : "#5bc1e6")};
  border-radius: 25px;
  padding: 0 60px 0 20px;
  font-size: 14px;
  color: #333;
  background: ${(props) => (props.readOnly ? "#fff" : "#f8fbff")};

  &:focus {
    outline: none;
    border-color: #5bc1e6;
    box-shadow: 0 0 0 3px rgba(91, 193, 230, 0.06);
  }

  &::placeholder {
    color: #ccc;
  }
`;

const EditButton = styled.button`
  position: absolute;
  right: 8px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;

  &:active {
    background: #e5e5e5;
    transform: scale(0.95);
  }
`;

const SaveCancelButtons = styled.div`
  position: absolute;
  right: 8px;
  display: flex;
  gap: 6px;
`;

const SaveButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #5bc1e6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;

  &:active {
    background: #4aa8d0;
    transform: scale(0.95);
  }
`;

const CancelButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;

  &:active {
    background: #e5e5e5;
    transform: scale(0.95);
  }
`;

const ButtonGrid = styled.div`
  width: 100%;
  max-width: 350px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const ActionButton = styled.button`
  aspect-ratio: 1;
  background-color: #5bc1e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
`;

const ActionLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
`;

const DetailCard = styled.div`
  width: 100%;
  max-width: 350px;
  min-height: 400px;
  border: 1px solid #eee;
  border-radius: 20px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const TableHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  justify-content: space-between;
  padding: 0 10px;
`;

const TableHeaderItem = styled.div`
  background-color: #f2f2f2;
  border-radius: 4px;
  padding: 8px 30px;
  font-size: 13px;
  color: #666;
  font-weight: 600;
  flex: 1;
  text-align: center;
`;

const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ParticipantItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f9f9f9;
`;

const ParticipantName = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NameText = styled.span`
  font-size: 14px;
`;

const ProbabilityText = styled.span`
  font-size: 11px;
  color: #5bc1e6;
  font-weight: 600;
`;

const ParticipantWeight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100px;
  justify-content: center;
`;

const WeightValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #5bc1e6;
  min-width: 20px;
  text-align: center;
`;

const WeightButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;

  &:active {
    background-color: #e0e0e0;
  }
`;

export default function ProgramDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const { programs, resetProgram, updateParticipantWeight, updateProgramName } =
    useProgramStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const program = programs.find((p) => p.id === id);

  useEffect(() => {
    if (program) {
      setEditedName(program.name);
    }
  }, [program]);

  if (!hasHydrated || !program) {
    return null;
  }

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(program.name);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateProgramName(id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(program.name);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const totalWeight = program.participants.reduce(
    (sum, p) => sum + p.weight,
    0
  );

  const handleWeightChange = (
    participantId: string,
    currentWeight: number,
    delta: number
  ) => {
    const newWeight = Math.max(1, currentWeight + delta);
    updateParticipantWeight(id, participantId, newWeight);
  };

  return (
    <>
      <Header />
      <Container>
        <NavHeader title="프로그램 상세 설정" />
        <Content>
          <NameInputContainer>
            <NameInput
              placeholder="프로그램 이름"
              value={editedName}
              readOnly={!isEditingName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleNameKeyDown}
            />
            {!isEditingName ? (
              <EditButton onClick={handleEditName}>
                <Edit2 size={16} />
              </EditButton>
            ) : (
              <SaveCancelButtons>
                <SaveButton onClick={handleSaveName}>
                  <Check size={16} />
                </SaveButton>
                <CancelButton onClick={handleCancelEdit}>
                  <XIcon size={16} />
                </CancelButton>
              </SaveCancelButtons>
            )}
          </NameInputContainer>

          <ButtonGrid>
            <ActionButton onClick={() => router.push(`/program/${id}/input`)}>
              <List size={28} />
              <ActionLabel>추첨대상 입력</ActionLabel>
            </ActionButton>
            <ActionButton onClick={() => router.push(`/program/${id}/config`)}>
              <Settings size={28} />
              <ActionLabel>제외대상 설정</ActionLabel>
            </ActionButton>
            <ActionButton
              onClick={() => {
                if (confirm("정말 초기화하시겠습니까?")) resetProgram(id);
              }}
            >
              <RotateCcw size={28} />
              <ActionLabel>자료 초기화</ActionLabel>
            </ActionButton>
          </ButtonGrid>

          <DetailCard>
            <TableHeader>
              <TableHeaderItem>항목</TableHeaderItem>
              <TableHeaderItem>비중</TableHeaderItem>
            </TableHeader>
            <ParticipantList>
              {program.participants.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#ccc",
                    marginTop: 80,
                    fontSize: 13,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <SearchX size={40} strokeWidth={1.5} />
                  <span>생성된 항목이 없습니다 (｡ﾉω＼｡).</span>
                </div>
              ) : (
                program.participants.map((p) => (
                  <ParticipantItem key={p.id}>
                    <ParticipantName>
                      <NameText>{p.name}</NameText>
                      {program.config?.showProbability && totalWeight > 0 && (
                        <ProbabilityText>
                          {((p.weight / totalWeight) * 100).toFixed(1)}%
                        </ProbabilityText>
                      )}
                    </ParticipantName>
                    <ParticipantWeight>
                      <WeightButton
                        onClick={() => handleWeightChange(p.id, p.weight, -1)}
                      >
                        -
                      </WeightButton>
                      <WeightValue>{p.weight}</WeightValue>
                      <WeightButton
                        onClick={() => handleWeightChange(p.id, p.weight, 1)}
                      >
                        +
                      </WeightButton>
                    </ParticipantWeight>
                  </ParticipantItem>
                ))
              )}
            </ParticipantList>
          </DetailCard>
        </Content>
      </Container>
    </>
  );
}
