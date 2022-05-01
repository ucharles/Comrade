import React from "react";
import { Layout } from "react-admin";
// import MyAppbar from "./MyAppbar";
import MyMenu from "./MyMenu";
import MyAppBar from "./MyAppBar";

const MyLayout = (props) => (
  <Layout {...props} menu={MyMenu} appBar={MyAppBar} />
);

export default MyLayout;
