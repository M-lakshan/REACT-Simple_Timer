function Timeset(props) {

  const setValue = (val,type) => props.setTimeFrame({val,type});

  return (
    <div className={`${props._type}-control`}>
      <h5 id={`${props._type}-label`}>{props._type==="break" ? "Break" : "Duration"}</h5>
      <div>
        <button
          id={`${props._type}-increment`}
          onClick={() => setValue("down",props._type)}>
          <i className="fa-solid fa-circle-chevron-down"></i>
        </button>
        <h4 id={`${props._type}-length`}>{props._val}</h4>
        <button
          id={`${props._type}-decrement`}
          onClick={() => setValue("up",props._type)}>
          <i className="fa-solid fa-circle-chevron-up"></i>
        </button>
      </div>
      <p>(minutes)</p>
    </div>
  );
}

export default Timeset;