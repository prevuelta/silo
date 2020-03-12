import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { formatDateTime } from "../util";

class DateTimeField extends Component {
  constructor(props) {
    super(props);
    const { formData } = props;
    let date = formData ? new Date(this.props.formData) : undefined;
    this.state = { date };
  }

  onChange(date) {
    this.setState({ date: new Date(date) });
    this.props.onChange(formatDateTime(date));
  }

  render() {
    const { date } = this.state;
    return (
      <DatePicker
        dateFormat="dd/MM/yyyy hh:mm aa"
        timeFormat="hh:mm aa"
        showTimeSelect
        timeIntervals={30}
        selected={date}
        onChange={date => this.onChange(date)}
      />
    );
  }
}

export default DateTimeField;
