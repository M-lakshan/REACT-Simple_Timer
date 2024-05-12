import React from 'react';

class Timeset extends React.Component {

  setValue(val,type) {
    this.props.setTimeFrame({val,type});
  }

  render() {
    return (
      <div className={this.props._class}>
        <h5 id={this.props._id}>{this.props._type}</h5>
        <div>
          <button
            id={this.props._ctrl_i_id}
            onClick={() => this.setValue("down",this.props._type.toLowerCase())}>
            <i className="fa-solid fa-circle-chevron-down"></i>
          </button>
          <h4 id={this.props._title}>{this.props._val}</h4>
          <button
            id={this.props._ctrl_ii_id}
            onClick={() => this.setValue("up",this.props._type.toLowerCase())}>
            <i className="fa-solid fa-circle-chevron-up"></i>
          </button>
        </div>
        <p>(minutes)</p>
      </div>
    );
  }
}

export default Timeset;