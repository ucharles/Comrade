import { UserMenu, useAuthState } from "react-admin";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import React from "react";

const MyCustomIcon = () => (
  <React.Fragment>
    <Avatar
      sx={{
        height: 30,
        width: 30,
      }}
      src="https://marmelab.com/images/avatars/adrien.jpg"
    />
    <Typography sx={{ paddingLeft: 1 }}>Hello World</Typography>
  </React.Fragment>
);

const MyUserMenu = (props) => {
  const { isLoading, authenticated } = useAuthState();

  if (isLoading) {
    return <React.Fragment></React.Fragment>;
  }
  if (authenticated) {
    return (
      <UserMenu
        {...props}
        icon={<MyCustomIcon />}
        label={"hello world"}></UserMenu>
    );
  }
  return <React.Fragment></React.Fragment>;
};

export default MyUserMenu;
