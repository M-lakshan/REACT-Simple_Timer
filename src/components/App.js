import { useState, useEffect } from "react";
import Timeset from './Timeset';
import '../styles/App.css';

function App() {

  const [SessionTime,SetSessionTime] = useState(3);
  const [SessionBreak,SetSessionBreak] = useState(2);
  const [SessionLength,SetSessionLength] = useState(1);
  const [SessionState,SetSessionState] = useState("stopped");
  const [SessionType,SetSessionType] = useState("countdown");
  const [SessionOnPause,SetSessionOnPause] = useState(false);

  const UpdateDurations = (value) => {
    let upd_val = (value["type"]==="break") ? SessionBreak : SessionLength;

    if(value["val"]==="up") {
      upd_val = (upd_val===1) ? 2 : ((upd_val===60) ? 60 : upd_val+1);
    } else {
      upd_val = (upd_val===1) ? 1 : ((upd_val===60) ? 59 : upd_val-1);
    }
        
    if(value["type"]==="break") {
      SetSessionBreak(upd_val);
    } else {
      SetSessionTime(upd_val*60);
      SetSessionLength(upd_val);
    } 
  }

  useEffect(() => {
    
    const timer = setInterval(() => {

      if(SessionState==="running" && !SessionOnPause) {

        if(SessionTime===0) {
          document.getElementById("beep").play();

          setTimeout(() => {
            SetSessionType((SessionType==="countdown") ? "break" : "countdown");  
            SetSessionTime(((SessionType==="countdown") ? SessionBreak : SessionLength)*60);  
          },1000);
        } else {
          setTimeout(() => document.getElementById("time-left").classList.remove("activated"), 1000);
          SetSessionTime(SessionTime-1);
        }
      }
    },1000);

    return () => clearInterval(timer);
  });

  const ManageSession = (type) => {
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

    if(type==="reset") {
      document.getElementById("beep").pause();
      document.getElementById("beep").currentTime = 0;
      
      SetSessionTime(1500);
      SetSessionBreak(5);
      SetSessionLength(25);
      SetSessionState("stopped");
      SetSessionType("countdown");
      SetSessionOnPause(false);
    } else if(type==="pause") {
      (SessionType!=="break") && SetSessionOnPause(!SessionOnPause);
    } else {
      SetSessionState("running");
      SetSessionOnPause(false);
    }
  }

  let ses_running = (SessionState==="running");
  let ses_on_countdown = (SessionType==="countdown");
  let param = ((!ses_running) ? "start" : (SessionOnPause ? "start" : "pause"));
  let btn_cls = (SessionOnPause ? "play" : ((ses_running) ? "pause" : "play"));
  let minutes = Math.floor(SessionTime / 60);
  let seconds = SessionTime % 60;
  
  return (
    <div id="Timer" className="App">
      <Timeset 
        setTimeFrame={(e) => UpdateDurations(e)}
        _type="break"
        _val={SessionBreak}
      />
      <Timeset 
        setTimeFrame={(e) => UpdateDurations(e)}
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