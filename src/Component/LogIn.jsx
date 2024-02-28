import React, { useState } from "react";
import { SHA256 } from 'crypto-js';
import { useMsal } from '@azure/msal-react';
import './LogIn.css';
import Particle from "../Particles";
import Fingerprint from '@mui/icons-material/Fingerprint';
import Effy from '../Image/Effy.png';

export default function LogIn() {
  const { instance } = useMsal();
  const [ codeVerifier, setCodeVerifier] = useState('');

  const generateCodeVerifier = () => {
    // Generate a random string as the code verifier
    const codeVerifier = Math.random().toString(36).substring(2);
    return codeVerifier;
  };

  const generateCodeChallenge = (codeVerifier) => {
    // Calculate the code challenge using SHA-256 hash algorithm
    const codeChallenge = SHA256(codeVerifier).toString();
    // Base64url encode the code challenge
    const base64UrlCodeChallenge = btoa(codeChallenge)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return base64UrlCodeChallenge;
  };

  const handleSignIn = () => {
    // Generate the code verifier
    const verifier = generateCodeVerifier();

    // Generate the code challenge based on the code verifier
    const challenge = generateCodeChallenge(verifier);

    // Store the code verifier
    setCodeVerifier(codeVerifier);

    // Construct the authentication request URL with code challenge
    const authorizationUrl = `https://login.microsoftonline.com/auth?response_type=code&code_challenge=${challenge}&code_challenge_method=S256&client_id=c1c55ec8-2ddf-4f4b-bab0-d11a1d54be82&redirect_uri=/`;

    // Redirect the user to the authentication provider
    window.location.href = authorizationUrl;
    instance.loginRedirect({
      scopes: ['user.read']
    });
  }
  
  return (
    <div className="loginBody">
      <div className="headerDiv">
        <div className="header"><h2 className="headerTxt"><img alt="Login" src={Effy}/>&nbsp;Portal</h2></div>
            <button className="signInBtn" onClick={handleSignIn}><Fingerprint/> Log In</button>
      </div>
      <Particle/>
      <div className="devWatermark">Developed by Edward Lee</div>
    </div>

  );
};