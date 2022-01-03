import React, { useReducer, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
      };

    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const TimeSetList = (props) => {
  // const [startTime, setStartTime] = useState([]);
  // const [endTime, setEndTime] = useState([]);
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value } = inputState;

  useEffect(() => {
    onInput(id, value);
  }, [id, value, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: inputState.value,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  return (
    <React.Fragment>
      <div
        className={`form-control ${
          !inputState.isValid && inputState.isTouched && "form-control--invalid"
        }`}>
        <label htmlFor={props.id}>{props.label}</label>
        <DatePicker
          value={inputState.value}
          onChange={changeHandler}
          disableDayPicker
          format="HH:mm"
          plugins={[<TimePicker hideSeconds />]}
        />
        {inputState.isTouched && <span>{props.errorText}</span>}
      </div>
    </React.Fragment>
  );
};

export default TimeSetList;
