import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Divide,
  Error,
  Form,
  HalfBox,
  Inner,
  Input,
  // Slogan,
  SubTitle,
  Switcher,
  // Title,
  Wrapper,
} from "../components/auth-components";
// import GithubButton from "../components/github-btn";
import SocialAuth from "../components/social-auth";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      // create an account
      // set the name of the user
      // redirect to the home page
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/home");
    } catch (e) {
      // setError
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <HalfBox>
        <Inner>
          <SocialAuth page="register" />

          <Divide>
            <span>또는</span>
          </Divide>

          <Form onSubmit={onSubmit}>
            <Input
              onChange={onChange}
              name="name"
              value={name}
              placeholder="이름"
              type="text"
              required
            />
            <Input
              onChange={onChange}
              name="email"
              value={email}
              placeholder="이메일"
              type="email"
              required
            />
            <Input
              onChange={onChange}
              name="password"
              value={password}
              placeholder="비밀번호"
              type="password"
              required
            />
            <Input
              type="submit"
              value={isLoading ? "계정 생성중..." : "계정 만들기"}
            />
          </Form>
          {error !== "" ? <Error>{error}</Error> : null}
          <Switcher>
            <SubTitle>이미 가입하셨나요?</SubTitle>
            <Link to="/login">로그인</Link>
          </Switcher>
        </Inner>
      </HalfBox>
    </Wrapper>
  );
}
