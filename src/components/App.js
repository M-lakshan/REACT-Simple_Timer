import { useState, useEffect } from "react";
import Timeset from './Timeset';
import '../styles/App.css';

function App() {

  const [SessionTime,SetSessionTime] = useState(new Date(15 * 1000).toISOString().substring(14, 19));
  const [SessionBreak,SetSessionBreak] = useState(1);
  const [SessionLength,SetSessionLength] = useState(2);
  const [SessionState,SetSessionState] = useState("stopped");
  const [SessionType,SetSessionType] = useState("countdown");
  const [SessionOnPause,SetSessionOnPause] = useState(false);

  const UpdateDurations = (value) => {

    try {
      let upd_val = (value["type"]==="break") ? SessionBreak : SessionLength;

      if(value["val"]==="up") {
        upd_val = (upd_val===1) ? 2 : ((upd_val===60) ? upd_val : upd_val+1);
      } else {
        upd_val = (upd_val===1) ? 1 : ((upd_val===60) ? 59 : upd_val-1);
      }
          
      console.log(upd_val)////////////////////////////////////////////////////////////////////////////////////////////
      if(value["type"]==="break") {
        SetSessionBreak(upd_val);
      } else {
        console.log("on_pause",(upd_val===60) ? "60:00" : new Date(upd_val * 60 * 1000).toISOString().substring(14, 19))////////////////////////////////////////////////////////////////////////////////////////////
        SetSessionTime((upd_val===60) ? "60:00" : new Date(upd_val * 60 * 1000).toISOString().substring(14, 19));
        SetSessionLength(upd_val);
      } 
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    
    const timer = setInterval(() => {
      if(SessionState==="running" && !SessionOnPause) {

        if(SessionTime.toString()==="00:00") {
          let upd_val = (SessionType==="countdown") ? SessionBreak : SessionLength;
          let upd_time = `${upd_val===60 ? 60 : ((upd_val<10) ? '0'+upd_val : upd_val)}:00`; 
          
          document.getElementById("beep").play();

          console.log("jump:",upd_time)////////////////////////////////////////////////////////////////////////////////////////////
          SetSessionType((SessionType==="countdown") ? "break" : "countdown");  
          SetSessionTime(upd_time);  
        } else {
          let dt = SessionTime.split(':').map(tm => parseInt(tm));
          let mns = (dt[1]-1!==0) ? dt[0] : ((dt[0]===0) ? 0 : dt[0]-1); 
          let scs = (dt[1]-1!==0) ? dt[1]-1 : ((dt[1]-1===0) ? 0 : 59);
          
          setTimeout(() => document.getElementById("time-left").classList.remove("activated"), 1000);
          
          console.log(SessionType,new Date(((mns*60) + scs) * 1000).toISOString().substring(14, 19))////////////////////////////////////////////////////////////////////////////////////////////
          SetSessionTime(new Date(((mns*60) + scs) * 1000).toISOString().substring(14, 19));  
        }
      }
    },100);

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
      
      SetSessionTime(new Date(1500 * 1000).toISOString().substring(14, 19));
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
              {SessionTime}
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