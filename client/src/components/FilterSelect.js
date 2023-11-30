import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const FilterSelect = ({ filterValue, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="filter-select-label">Filter</InputLabel>
      <Select
        labelId="filter-select-label"
        id="filter-select"
        value={filterValue}
        label="Filter"
        onChange={handleChange}
      >
        <MenuItem value="order/deadline">Order by Deadline</MenuItem>
        <MenuItem value="order/priority">Order by Priority</MenuItem>
        <MenuItem value="type/Exam">Show Exams</MenuItem>
        <MenuItem value="type/Assignment">Show Assignments</MenuItem>
        <MenuItem value="type/Project">Show Projects</MenuItem>
        {/* <MenuItem value="courses">By Course</MenuItem> */}
        {/* /courses currently not working */}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
