import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import styled from "styled-components";
  import { auth } from "../firebase";
  import { useNavigate } from "react-router-dom";
  
  export interface PageSet {
    page: string;
  }
  
  const SocialBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
  `;
  
  const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
    max-width: 300px;
    padding: 10px 20px;
    background-color: white;
    border-radius: 50px;
    border: 0;
    font-weight: 500;
    color: black;
    cursor: pointer;
  `;
  
  const Logo = styled.img`
    height: 18px;
  `;
  
  export default function SocialAuth({ page }: PageSet) {
    const navigate = useNavigate();
    const platform = ["google", "github"];
    const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
  
      const { name } = e.currentTarget;
  
      try {
        const provider =
          name === "github" ? new GithubAuthProvider() : new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        navigate("/home");
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <SocialBox>
        {platform.map((v) => (
          <Button
            key={v}
            name={v}
            onClick={onSocialClick}
          >
            <Logo src={`${v}-logo.svg`} />
            {v.charAt(0).toUpperCase() + v.slice(1)} 계정으로{" "}
            {page === "login" ? "로그인" : "가입하기"}
          </Button>
        ))}
      </SocialBox>
    );
  }
  