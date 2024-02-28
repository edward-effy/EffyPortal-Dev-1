import "./PageLayout.css";
import NavBar from "../Component/NavBar";
import LogIn from "../Component/LogIn";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import Carnival from "../Image/Carnival.png";
import Norwegian from "../Image/NCL.png";
import DirectionsBoatRoundedIcon from "@mui/icons-material/DirectionsBoatRounded";
//import Particles from '../Particles';
//import { Button } from '@mui/material';

const PageLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  // Check if the user is authenticated. If yes, render the BodyPage component. Otherwise, render the LogIn component.
  return <>{isAuthenticated ? <BodyPage /> : <LogIn />}</>;
};

const BodyPage = () => {
  const navigate = useNavigate();

  function clickCarnival(event) {
    event.preventDefault();
    navigate("/Carnival");
  }
  function clickNCL(event) {
    event.preventDefault();
    navigate("/NCL");
  }
  function clickOther(event) {
    event.preventDefault();
    alert("Coming Soon!");
  }

  return (
    <div className="layoutBackground">
      <NavBar />
      {/* Render two buttons for Carnival and NCL functionalities. When clicked, navigate to the respective pages. */}
      <div className="btnContainer">
        <div className="glassmorphic">
          <div className="imgBox">
            <i className="cclPic">
              <img className="carnivalPic" src={Carnival} alt="Carnival" />
            </i>
          </div>
          <h3>Carnival Cruise Line Invoice Data</h3>
          <div className="contentBoxCCL">
            <button className="buttons" onClick={clickCarnival}>Carnival</button>
          </div>
        </div>
        <div className="glassmorphic">
          <div className="imgBox">
            <i className="nclPic">
              <img className="norwegianPic" src={Norwegian} alt="Norwegian" />
            </i>
          </div>
          <h3>Norwegian Cruise Line Invoice Data</h3>
          <div className="contentBoxNCL">
            <button className="buttons" onClick={clickNCL}>Norwegian</button>
          </div>
        </div>
        <div className="glassmorphic">
          <div className="imgBox">
            <i className="otherPic">
              <DirectionsBoatRoundedIcon style={{ fontSize: "5.5rem" }} />
            </i>
          </div>
          <div className="contentBoxOther">
            <h3>Other</h3>
            <button className="buttons" onClick={clickOther}>Other</button>
          </div>
        </div>
      </div>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default PageLayout;
