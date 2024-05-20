function Timeset(props) {

  return (
    <div className={`${props._type}-control`}>
      <h5 id={`${props._type}-label`}>{props._type==="break" ? "Break" : "Duration"}</h5>
      <div>
        <button
          id={`${props._type}-decrement`}
          onClick={() => props.setTimeFrame(Math.max((props._val/60)-1,1))}>
          <i className="fa-solid fa-circle-chevron-down"></i>
        </button>
        <h4 id={`${props._type}-length`}>{props._val/60}</h4>
        <button
          id={`${props._type}-increment`}
          onClick={() => props.setTimeFrame(Math.min((props._val/60)+1,60))}>
          <i className="fa-solid fa-circle-chevron-up"></i>
        </button>
      </div>
      <p>(minutes)</p>
    </div>
  );
}

export default Timeset;