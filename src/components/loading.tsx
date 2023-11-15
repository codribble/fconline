import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const Text = styled.p`
  font-size: 24px;
`;

export default function Loading() {
  return (
    <Wrapper>
      <Text>Loading...</Text>
    </Wrapper>
  );
}
