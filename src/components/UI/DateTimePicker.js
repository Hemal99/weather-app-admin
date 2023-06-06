import React from "react";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from "@material-ui/pickers";


const DateTimePickerField = ({ field, form, ...other }) => {
    // const currentError = form.errors[field.name];
  
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker   
        clearable     
        ampm={false}
        format='MM/dd/yyyy HH:mm'
        disablePast      
        name={field.name}
        inputVariant="outlined"      
        value={field.value}       
        // helperText={currentError}
        // error={Boolean(currentError)}
        // onError={error => {
        //   // handle as a side effect
        //   if (error !== currentError) {
        //     form.setFieldError(field.name, error);
        //   }
        // }}      
        {...other}
      />
      </MuiPickersUtilsProvider>
    );
  };

export default DateTimePickerField