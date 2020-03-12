import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { formatDate } from "../util";

class DateField extends Component {
  constructor(props) {
    super(props);
    const { formData } = props;
    let date = formData ? new Date(this.props.formData) : undefined;
    this.state = { date };
  }

  onChange(date) {
    this.setState({ date });

    this.props.onChange(formatDate(date));
  }

  render() {
    const { date } = this.state;
    return (
      <DatePicker
        dateFormat="dd/MM/yyyy"
        selected={date}
        onChange={date => this.onChange(date)}
      />
    );
  }
}

export default DateField;
