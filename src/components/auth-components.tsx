import styled from "styled-components";

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 437px;
  max-width: 760px;
  /* height: 100%;
  padding: 50px 0px; */
  padding: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 32px;
  font-weight: 700;
  font-size: 31px;
  color: rgb(231, 233, 234);
  line-height: 1.16;

  &.nomargin {
    margin-bottom: 0px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 15px;
  &[type="submit"] {
    background-color: #1d9bf0;
    font-weight: 700;
    color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.div`
  margin-top: 40px;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    max-width: 380px;
    height: 40px;
    background-color: transparent;
    border: 1px solid rgb(83, 100, 113);
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    color: #1d9bf0;
    line-height: 1.3;
    text-decoration: none;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  flex: 1 1 auto;
  min-height: 100%;
`;

export const Divide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 300px;
  max-width: 380px;
  margin: 8px 0px;
  font-size: 15px;
  color: rgb(231, 233, 234);
  line-height: 1.3;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: rgb(47, 51, 54);
  }

  & span {
    position: relative;
    padding: 0 8px;
    background-color: black;
  }
`;

export const Slogan = styled.strong`
  display: flex;
  margin: 48px 0px;
  font-size: 64px;
  font-weight: 700;
  color: rgb(231, 233, 234);
  line-height: 1.3;
`;

export const SubTitle = styled.strong`
  display: flex;
  max-width: 380px;
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: 700;
  color: rgb(231, 233, 234);
`;

export const Desc = styled.p`
  margin-top: 8px;
  margin-bottom: 32px;
  font-size: 15px;
  color: rgb(113, 118, 123);
  line-height: 1.3;
`;

export const HalfBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  &:first-child {
    width: 45vw;
    padding: 16px;
  }
  &:last-child {
    overflow: hidden;
    flex: 1;
    justify-content: center;
    min-height: 45vh;
  }
`;

export const ForgotPasswordBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 36px;
  max-width: 300px;
  min-height: 36px;
  padding: 0px 16px;
  background-color: transparent;
  border: 1px solid rgb(83, 100, 113);
  border-radius: 50px;
  font-weight: 700;
  font-size: 15px;
  color: rgb(239, 243, 244);
  line-height: 1.3;
  cursor: pointer;
`;
