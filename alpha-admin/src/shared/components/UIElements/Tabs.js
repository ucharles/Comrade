import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import List from "./List";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth">
          <Tab
            label={`Match: ${props.obj.intersection.length}`}
            {...a11yProps(0)}
          />
          <Tab
            label={`Unmatch: ${props.obj.noIntersection.length}`}
            {...a11yProps(1)}
          />
          <Tab
            label={`No event: ${props.obj.noEvent.length}`}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <List obj={props.obj.intersection} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List obj={props.obj.noIntersection} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <List obj={props.obj.noEvent} />
      </TabPanel>
    </Box>
  );
}
