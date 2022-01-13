import { InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";

export default function TimePicker(props) {
  return (
    <React.Fragment>
      <InputLabel id="hour-selector">{props.label}</InputLabel>

      <Select id="hour-selector" value={props.hour}>
        <MenuItem value="00">00</MenuItem>
        <MenuItem value="00">01</MenuItem>
        <MenuItem value="00">02</MenuItem>
        <MenuItem value="00">03</MenuItem>
        <MenuItem value="00">04</MenuItem>
        <MenuItem value="00">05</MenuItem>
        <MenuItem value="00">06</MenuItem>
        <MenuItem value="00">07</MenuItem>
        <MenuItem value="00">08</MenuItem>
        <MenuItem value="00">09</MenuItem>
        <MenuItem value="00">10</MenuItem>
        <MenuItem value="00">11</MenuItem>
        <MenuItem value="00">12</MenuItem>
        <MenuItem value="00">13</MenuItem>
        <MenuItem value="00">14</MenuItem>
        <MenuItem value="00">15</MenuItem>
        <MenuItem value="00">16</MenuItem>
        <MenuItem value="00">17</MenuItem>
        <MenuItem value="00">18</MenuItem>
        <MenuItem value="00">19</MenuItem>
        <MenuItem value="00">20</MenuItem>
        <MenuItem value="00">21</MenuItem>
        <MenuItem value="00">22</MenuItem>
        <MenuItem value="00">23</MenuItem>
      </Select>
    </React.Fragment>
  );
}
