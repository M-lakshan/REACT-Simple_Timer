import React from 'react';
import Timeset from './Timeset';
import '../styles/App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.UpdateSession = this.UpdateSession.bind(this);

    this.state = {
      session_time: new Date(1500 * 1000).toISOString().substring(14, 19),
      session_break: 5,
      session_length: 25,
      session_state: "stopped",
      session_paused: false,
      session_type: "countdown",
      session_intervalID: 0
    }
  }

  ChangeSessionState(secs_val) {
    
    this.setState(prevState => { 
      return {
        session_break: prevState.session_break,
        session_length: prevState.session_length,
        session_time: new Date(secs_val-1).toString().split(' ')[4].substring(3,8),
        session_state: "running",
        session_paused: false,
        session_type: (prevState.session_type==="countdown") ? "break" : "countdown"
      }
    });
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
        let displayed_time = this.state.session_time;
        let local_date = new Date();
        let current_date = local_date.getFullYear()+'-'+
                          (local_date.getMonth()<10 ? '0'+local_date.getMonth() : local_date.getMonth())+'-'+
                          (local_date.getDate()<10 ? '0'+local_date.getDate() : local_date.getDate());
        let dsp_time_in_secs = new Date(`${current_date}T0${displayed_time==="60:00" ? "1:00:00" : ("0:"+displayed_time)}`).getTime(); 
        let upd_time = new Date(dsp_time_in_secs-1).toString().split(' ')[4].substring(3,8);

        setTimeout(() => countdown.classList.remove("activated"), 1000);
          
        this.setState({ session_time: upd_time });

        if(upd_time==="00:00") {
          let upd_val = (this.state.session_type==="countdown") ? this.state.session_break : this.state.session_length;
          let updated_time = new Date(`${current_date}T0${upd_val===60 ? "1:00:00" : (`0:${upd_val<10 ? '0'+upd_val : upd_val}:00`)}`).getTime(); 
          
          document.getElementById("beep").play();

          setTimeout(() => this.ChangeSessionState(updated_time),1000);
        }
      }, 1000);
      
      this.setState(prevState => {
        return {
          ...prevState,
          session_state: "running",
          session_paused: false,
          session_intervalID: newIntervalId
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
        this.setState({
          session_length: upd_val,
          session_time: (upd_val===60) ? "60:00" : new Date(upd_val * 60 * 1000).toISOString().substring(14, 19)
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