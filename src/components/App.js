import React from 'react';
import Timeset from './Timeset';
import '../styles/App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.UpdateSession = this.UpdateSession.bind(this);

    let deafult_time = new Date("1970-01-01T00:00:02").toTimeString().split(' ')[0].split(':');

    this.state = {
      session_time: deafult_time[1]+':'+deafult_time[2],
      session_break: 5,
      session_length: 25,
      session_state: "stopped",
      session_paused: false,
      session_type: "countdown"
    }
  }

  StartStopSession(type) {
    let countdown = document.getElementById("time-left");

    (this.state.session_state==="stopped") ? countdown.classList.add("activated") : countdown.classList.add("stopped");  
    setTimeout(() => {
      countdown.classList.remove("activated");
      countdown.classList.remove("stopped");
    }, 1000);

    try {
    
      if(type==="start") {
        setTimeout(() => this.Countdown(type), 100);
        
        this.setState({ 
          session_state: "running",
          session_paused: false
        });
      } else {
        let updated_time = new Date(`1970-01-01T00:${
          countdown.innerHTML.split(':')[0]+':'+
          countdown.innerHTML.split(':')[1]}`)
          .toTimeString().toString().split(' ')[0].split(':');
      
        setTimeout(() => this.Countdown(type), 50);
        
        setTimeout(() => this.setState({ 
          session_time: updated_time[1]+':'+updated_time[2],
          session_state: "stopped",
          session_paused: false
        }), 100);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  PauseSession(sts) {
    let countdown = document.getElementById("time-left");
    let new_ses_len_i = countdown.innerHTML.split(':')[0];
    let new_ses_len_ii = countdown.innerHTML.split(':')[1];

    try {
      let updated_time = new Date(`1970-01-01T00:${(new_ses_len_i+':'+new_ses_len_ii)}`).toTimeString().split(' ')[0].split(':');
      
      setTimeout(() => this.Countdown((sts) ? "start" : "stop"), 50);
      
      setTimeout(() => this.setState({ 
        session_time: updated_time[1]+':'+updated_time[2],
        session_paused: sts
      }), 100);
    } catch (ex) {
      console.log(ex);
    }
  }

  UpdateSession(value) {
    let break_limit = (this.state.session_break>1 && this.state.session_break<60); 
    let length_limit = (this.state.session_length>1 && this.state.session_length<60); 
    
    try {
    
      if(value["type"]==="break") {
        this.setState({ session_break: (break_limit) ? this.state.session_break+((value["val"]==="up") ? 1 : (-1)) : this.state.session_break });
      } else {
        let updated_time;
        let new_ses_len = (length_limit) ? this.state.session_length+((value["val"]==="up") ? 1 : (-1)) : this.state.session_length;
        
        if(new_ses_len!==60) {
          updated_time = new Date(`1970-01-01T00:${(new_ses_len.toString().length===1) ? '0'+new_ses_len : new_ses_len}:00`)
                        .toTimeString().split(' ')[0].split(':');
        } else {
          updated_time = "00:60:00".split(":");
        }
        
        this.setState({
          session_length: new_ses_len,
          session_time: updated_time[1]+':'+updated_time[2]
        });
      } 
    } catch (ex) {
      console.log(ex);
    }
  }
  
  ResetSession() {
    // (localStorage.getItem("run_countdown")) && window.clearInterval(localStorage.getItem("run_countdown"));
    (localStorage.getItem("run_countdown")) && window.clearInterval(localStorage.getItem("run_countdown"));

    try {
      let new_time = document.getElementById("session-length").innerHTML;

      this.setState(
        {
          session_time: (new_time.length<2 ? '0'+new_time : new_time) + ":00",
          session_break: 5,
          session_length: 25,
          session_state: "stopped",
          session_paused: false,
          session_type: "countdown"
        }
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  Countdown(type) {
    let countdown = document.getElementById("time-left");

    if(type==="start") {
      !countdown.classList.contains("active") && countdown.classList.add("active");
      countdown.classList.add("activated");

      setTimeout(() => {
        countdown.classList.remove("activated");
        countdown.classList.remove("postponed");
      }, 1000);

      localStorage.setItem("run_countdown",window.setInterval(() => {
        
        let minutes = (parseInt(countdown.innerHTML.split(':')[1])===0) ? (parseInt(countdown.innerHTML.split(':')[0])-1).toString() : countdown.innerHTML.split(':')[0];
        let seconds = (parseInt(countdown.innerHTML.split(':')[1])===0) ? "60" : countdown.innerHTML.split(':')[1];
        
        minutes = minutes.length<2 ? '0'+minutes : minutes;
        seconds = (parseInt(seconds)-1).toString().length<2 ? '0'+(parseInt(seconds)-1).toString() : parseInt(seconds)-1;
        countdown.innerHTML = minutes+':'+seconds;

        (parseInt(minutes)===0 && parseInt(seconds-1)===0) && window.clearInterval(localStorage.getItem("run_countdown"));

        let updated_time;

        if(this.state.session_type==="countdown") {
          updated_time = ((document.getElementById("break-length").innerHTML.length<2) ? '0'+document.getElementById("break-length").innerHTML : document.getElementById("break-length").innerHTML)+":00";
        } else {
          updated_time = new Date(`1970-01-01T00:${document.getElementById("session-length").innerHTML}:00`).toTimeString().split(' ')[0].split(':');
          updated_time = updated_time[1]+":00";
        }

        (parseInt(minutes)===0 && parseInt(seconds-1)===0) && this.setState({
          session_break: parseInt(document.getElementById("break-length").innerHTML),
          session_length: parseInt(document.getElementById("session-length").innerHTML),
          session_time: updated_time,
          session_state: "running",
          session_paused: false,
          session_type: (this.state.session_type==="countdown") ? "break" : "countdown"
        });

        (parseInt(minutes)===0 && parseInt(seconds-1)===0) && this.StartStopSession("start");
      }, 1000));
    } else {
      countdown.classList.remove("active");
      countdown.classList.add("postponed");
    
      (localStorage.getItem("run_countdown")) && window.clearInterval(localStorage.getItem("run_countdown"));

      setTimeout(() => countdown.classList.remove("postponed"), 1000);
    }
  }
 
  render() {

    return (
      <div id="Timer" className="App">
        <Timeset 
          setTimeFrame={(e) => this.UpdateSession(e)}
          _id="break-label"
          _class="break-control"
          _type="Break"
          _ctrl_i_id="break-decrement"
          _ctrl_ii_id="break-increment"
          _title="break-length"
          _val={this.state.session_break}
        />
        <Timeset 
          setTimeFrame={(e) => this.UpdateSession(e)}
          _id="session-label"
          _class="session-control"
          _type="Duration"
          _ctrl_i_id="session-decrement"
          _ctrl_ii_id="session-increment"
          _title="session-length"
          _val={this.state.session_length}
        /> 
        <section className="timer">
          <div className="container">
            <h3 id="timer-label">
              {(this.state.session_type==="countdown") ? "Session" : "Break"}
            </h3>
            <p id="time-left" 
              className={
                (this.state.session_state==="running") ? ((this.state.session_type==="countdown") ? "active" : "on_break") : "deactivated"
              }>{this.state.session_time}
            </p>
          </div>
          <div className="controls">
            <button id="start_stop" onClick={() => this.StartStopSession((this.state.session_state==="running" ? "stop" : "start"))}>
              <i className={`fa-solid fa-${this.state.session_state==="running" ? "stop" : "play"}`}></i>
            </button>
            <button id="pause" onClick={() => this.PauseSession(!this.state.session_paused)}>
              <i className="fa-solid fa-pause"></i>
            </button>
            <button id="reset" onClick={() => this.ResetSession()}>
              <i className="fa-solid fa-rotate"></i>
            </button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;