import { UserMenu, useAuthState } from "react-admin";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyCustomIcon = (props) => (
  <React.Fragment>
    <Avatar
      sx={{
        height: 30,
        width: 30,
      }}
      src={props.userData.img}
    />
    <Typography sx={{ paddingLeft: 1 }}>{props.userData.username}</Typography>
  </React.Fragment>
);

const MyUserMenu = (props) => {
  const { isLoading, authenticated } = useAuthState();
  const [userData, setUserData] = useState({ username: "", img: "" });

  const getUser = async () => {
    const response = await axios(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      withCredentials: true,
    });
    let img = "";
    if (response.data.user.image !== undefined) {
      img = `${process.env.REACT_APP_ASSET_URL}/${response.data.user.image}`;
    }
    setUserData((prevUserData) => ({
      ...prevUserData,
      username: response.data.user.username,
      img: img,
    }));
  };
  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return <React.Fragment></React.Fragment>;
  }
  if (authenticated) {
    return (
      <UserMenu
        {...props}
        icon={<MyCustomIcon userData={userData} />}
        label={userData.username}
      ></UserMenu>
    );
  }
  return <React.Fragment></React.Fragment>;
};

export default MyUserMenu;
