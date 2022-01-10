import React from "react";
import { Layout } from "react-admin";
// import MyAppbar from "./MyAppbar";
import MyMenu from "./MyMenu";

const MyLayout = (props) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
