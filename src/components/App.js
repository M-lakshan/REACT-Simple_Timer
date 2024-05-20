import { useState, useEffect } from "react";
import Timeset from './Timeset';
import '../styles/App.css';

function App() {

  const [SessionTime,setSessionTime] = useState(1500);
  const [SessionBreak,setSessionBreak] = useState(300);
  const [SessionLength,setSessionLength] = useState(1500);
  const [SessionState,setSessionState] = useState("stopped");
  const [SessionType,setSessionType] = useState("countdown");
  const [SessionOnPause,setSessionOnPause] = useState(false);

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

      if(SessionState==="running" && !SessionOnPause) {

        if(SessionTime-1===0) {
          document.getElementById("beep").play();
        }

        if(SessionTime===0) {
          clearInterval(timer);

          setTimeout(() => ManageSession("change"),1000);
        } else {
          setTimeout(() => document.getElementById("time-left").classList.remove("activated"), 1000);
          setSessionTime(SessionTime-1);
        }
      }
    },1000);

    return () => clearInterval(timer);
  });

  const ManageSession = (type) => {
/*
    let countdown = document.getElementById("time-left");
    
    if(SessionState==="stopped") {
      countdown.classList.add("activated");
    } else {

      if(SessionType!=="break") {

        if(!SessionOnPause) {
          countdown.classList.add("postponed");
        } else {
          (type==="reset") ? countdown.classList.add("stopped") : countdown.classList.add("activated");
        }
      }
    }

    setTimeout(() => {
      countdown.classList.remove("activated");
      countdown.classList.remove("postponed");
      countdown.classList.remove("stopped");
      (type==="reset") && countdown.classList.remove("active");
    }, 1000);
*/
    if(type==="reset") {
      document.getElementById("beep").pause();
      document.getElementById("beep").currentTime = 0;
      
      setSessionOnPause(false);
      setSessionState("stopped");
      setSessionType("countdown");
      setSessionBreak(300);
      setSessionLength(1500);
      setSessionTime(1500);
    } else if(type==="pause") {
      (SessionType!=="break") && setSessionOnPause(!SessionOnPause);
    } else if(type==="change") {
      setSessionType((SessionType==="countdown") ? "break" : "countdown");  
      setSessionTime(((SessionType==="countdown") ? SessionBreak : SessionLength));
    } else {
      setSessionOnPause(false);
      setSessionState("running");
    }
  }

  let ses_running = (SessionState==="running");
  let ses_on_countdown = (SessionType==="countdown");
  let param = ((!ses_running) ? "start" : (SessionOnPause ? "start" : "pause"));
  let btn_cls = (!ses_running ? "play" : ((SessionOnPause) ? "play" : "pause"));
  let minutes = Math.floor(SessionTime / 60);
  let seconds = SessionTime % 60;
  
  return (
    <div id="Timer" className="App">
      <Timeset 
        setTimeFrame={(e) => UpdateDurations(e,"break")}
        _type="break"
        _val={SessionBreak}
      />
      <Timeset 
        setTimeFrame={(e) => UpdateDurations(e,"session")}
        _type="session"
        _val={SessionLength}
      />
      <section className="timer">
        <div className="container">
          <h3 id="timer-label">{(ses_on_countdown) ? "Session" : "Break"}</h3>
          <p id="time-left" 
            className={(ses_running) ? ((ses_on_countdown) ? "active activated" : "on_break") : "deactivated"}>
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