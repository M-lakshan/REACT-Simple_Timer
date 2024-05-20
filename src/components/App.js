import { useState, useEffect } from "react";
import Timeset from './Timeset';
import '../styles/App.css';

function App() {

  const [sessionTime,setSessionTime] = useState(1500);
  const [sessionBreak,setSessionBreak] = useState(300);
  const [sessionLength,setSessionLength] = useState(1500);
  const [sessionState,setSessionState] = useState("stopped");
  const [sessionType,setSessionType] = useState("countdown");
  const [sessionOnPause,setSessionOnPause] = useState(false);
  const [timeLeftStyle,setTimeLeftStyle] = useState({ color: "#FFF", backgroundColor: "#2e8cd4" });

  const UpdateDurations = (value,type) => {

    if(type==="break") {
      setSessionBreak(value*60);
    } else {
      setSessionTime(value*60);
      setSessionLength(value*60);
    } 
  }

  useEffect(() => {
    
    const timer = setInterval(() => {

      if(sessionState==="running" && !sessionOnPause) {

        if(sessionTime-1===0) {
          document.getElementById("beep").play();
        }

        if(sessionTime===0) {
          clearInterval(timer);

          setTimeout(() => ManageSession("change"),1000);
        } else {
          setTimeout(() => document.getElementById("time-left").classList.remove("activated"), 1000);
          setSessionTime(sessionTime-1);
        }
      }
    },1000);

    return () => clearInterval(timer);
  });

  const ManageSession = (type) => {

    if(type==="reset") {
      document.getElementById("beep").pause();
      document.getElementById("beep").currentTime = 0;
      
      setSessionOnPause(false);
      setSessionState("stopped");
      setSessionType("countdown");
      setSessionBreak(300);
      setSessionLength(1500);
      setSessionTime(1500);
      setTimeLeftStyle({ animation: "on_stop 2s linear 0.2s 1 normal forwards" });
    } else if(type==="pause") {
      (sessionType!=="break") && setTimeLeftStyle({ animation: "on_pause 0.35s linear 0s 1 normal forwards" });
      (sessionType!=="break") && setSessionOnPause(!sessionOnPause);
    } else if(type==="change") {
      let sessionOnBreak = (sessionType==="break");
      let customAnimation = (sessionOnBreak) ? "on_start 2s ease-in-out" : "time_jump 1.2s linear";

      setTimeLeftStyle({ animation: `${customAnimation} 0s 1 normal forwards` });
      setSessionType((sessionOnBreak) ? "countdown" : "break");  
      setSessionTime((sessionOnBreak) ? sessionLength : sessionBreak);
    } else {
      setTimeLeftStyle({ animation: "on_start 2.5s ease-in-out 0s 1 normal forwards" });
      setSessionOnPause(false);
      setSessionState("running");
    }
  }

  let ses_running = (sessionState==="running");
  let ses_on_countdown = (sessionType==="countdown");
  let param = ((!ses_running) ? "start" : (sessionOnPause ? "start" : "pause"));
  let btn_cls = (!ses_running ? "play" : ((sessionOnPause) ? "play" : "pause"));
  let minutes = Math.floor(sessionTime / 60);
  let seconds = sessionTime % 60;
  
  return (
    <div id="Timer" className="App">
      <Timeset 
        setTimeFrame={(e) => UpdateDurations(e,"break")}
        _type="break"
        _val={sessionBreak}
      />
      <Timeset 
        setTimeFrame={(e) => UpdateDurations(e,"session")}
        _type="session"
        _val={sessionLength}
      />
      <section className="timer">
        <div className="container">
          <h3 id="timer-label">{(ses_on_countdown) ? "Session" : "Break"}</h3>
          <p id="time-left" style={timeLeftStyle}>
            {minutes < 10 ? '0'+minutes : minutes}:{seconds < 10 ? '0'+seconds : seconds}
          </p>
        </div>
        <div className="controls">
          <button id="start_stop" onClick={() => ManageSession(param)}>
            <i className={`fa-solid fa-${btn_cls}`}></i>
          </button>
          <button id="reset" onClick={() => ManageSession("reset")}>
            <i className="fa-solid fa-rotate"></i>
          </button>
          <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
        </div>
      </section>
    </div>
  );
}

export default App;