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
      session_type: "countdown",
      session_intervalID: 0
    }
  }

  ManageSession(type) {
    let countdown = document.getElementById("time-left");
    
    if(this.state.session_state==="stopped") {
      countdown.classList.add("activated");
    } else {

      if(!this.state.session_paused) {
        countdown.classList.add("postponed");
      } else {
        (type==="reset") ? countdown.classList.add("stopped") : countdown.classList.add("activated");
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

      if(this.state.session_intervalID!==0) {
        clearInterval(this.state.session_intervalID);

        this.setState(
          {
            session_time: "25:00",
            session_break: 5,
            session_length: 25,
            session_state: "stopped",
            session_paused: false,
            session_type: "countdown",
            session_intervalID: 0
          }
        );
      } else {
        this.setState(
          {
            session_time: "25:00",
            session_break: 5,
            session_length: 25,
            session_state: "stopped",
            session_paused: false,
            session_type: "countdown"
          }
        );
      }
    } else if(type==="pause") {
      let new_ses_len_i = countdown.innerHTML.split(':')[0];
      let new_ses_len_ii = countdown.innerHTML.split(':')[1];
      let updated_time = new Date(`1970-01-01T00:${(new_ses_len_i+':'+new_ses_len_ii)}`).toTimeString().split(' ')[0].split(':');
    
      if(this.state.session_intervalID!==0 && this.state.session_type!=="break") {
        clearInterval(this.state.session_intervalID);

        this.setState(
          {
            session_time: updated_time[1]+':'+updated_time[2],
            session_state: "running",
            session_paused: true,
            session_intervalID: 0
          }
        );
      }
    } else {
      const newIntervalId = setInterval(() => {
        let mnt = parseInt(countdown.innerHTML.split(':')[0]);
        let minutes = (parseInt(countdown.innerHTML.split(':')[1])!==0) ? countdown.innerHTML.split(':')[0] : ((mnt!==0) ? (mnt-1).toString() : mnt);
        let seconds = (parseInt(countdown.innerHTML.split(':')[1])===0) ? "60" : countdown.innerHTML.split(':')[1];
        
        setTimeout(() => countdown.classList.remove("activated"), 1000);

        minutes =  minutes.length<2 ? '0'+minutes : minutes;
        seconds = (parseInt(seconds)-1).toString().length<2 ? '0'+(parseInt(seconds)-1) : (parseInt(seconds)-1).toString();
        
        this.setState(prevState => { return { prevState, session_time: (minutes+':'+seconds)}});
        
        if(this.state.session_time==="00:00") {
          let updated_time;
          let ses_brk = document.getElementById("break-length").innerHTML;
          let ses_len = document.getElementById("session-length").innerHTML;

          document.getElementById("beep").play();

          if(this.state.session_type==="countdown") {
            updated_time = ((ses_brk.length<2) ? '0'+ses_brk : ses_brk)+":00";
          } else {
            updated_time = new Date(`1970-01-01T00:${(ses_len.length<2) ? '0'+ses_len : ses_len}:00`).toTimeString().split(' ')[0].split(':')[1]+":00";
          }

          setTimeout(this.setState(prevState => { 
            // clearInterval(prevState.session_intervalID);

            return {
              session_break: parseInt(ses_brk),
              session_length: parseInt(ses_len),
              session_time: updated_time.toString(),
              session_state: "running",
              session_paused: false,
              session_type: (prevState.session_type==="countdown") ? "break" : "countdown",
              // session_intervalID: 0
            }
          }),1000);
        }

        return 0;
      }, 1000);
      
      this.setState(prevState => {
        return {
          ...prevState,
          session_state: "running",
          session_paused: false,
          session_intervalID: newIntervalId,
        };
      });
    }
  }

  UpdateSession(value) {

    try {
      let upd_val = (value["type"]==="break") ? this.state.session_break : this.state.session_length;

      if(value["val"]==="up") {
        upd_val = (upd_val===1) ? 2 : ((upd_val===60) ? upd_val : upd_val+1);
      } else {
        upd_val = (upd_val===1) ? 1 : ((upd_val===60) ? 59 : upd_val-1);
      }
    
      if(value["type"]==="break") {
        this.setState({ session_break: upd_val });
      } else {
        let updated_time;
        
        if(upd_val===60) {
          updated_time = "00:60:00".split(":");
        } else {
          updated_time = new Date(`1970-01-01T00:${(upd_val.toString().length===1) ? '0'+upd_val : upd_val}:00`)
                        .toTimeString().split(' ')[0].split(':');
        }
        
        this.setState({
          session_length: upd_val,
          session_time: updated_time[1]+':'+updated_time[2]
        });
      } 
    } catch (ex) {
      console.log(ex);
    }
  }

  componentDidMount() {
    
  }
 
  render() {
    let param = (this.state.session_state==="running" ? ((this.state.session_paused) ? "start" : "pause") : "start");
    
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
              className={(this.state.session_state==="running") ? ((this.state.session_type==="countdown") ? "active activated" : "on_break") : "deactivated"}>
                {this.state.session_time}
            </p>
          </div>
          <div className="controls">
            <button id="start_stop" onClick={() => this.ManageSession(param)}>
              <i className={`fa-solid fa-${this.state.session_state==="running" ? "stop" : "play"}`}></i>
            </button>
            <button id="pause" onClick={() => this.ManageSession(param)}>
              <i className="fa-solid fa-pause"></i>
            </button>
            <button id="reset" onClick={() => this.ManageSession("reset")}>
              <i className="fa-solid fa-rotate"></i>
            </button>
            <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
          </div>
        </section>
      </div>
    );
  }
}

export default App;