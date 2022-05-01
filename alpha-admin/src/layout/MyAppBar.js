import { AppBar } from "react-admin";
import MyUserMenu from "./MyUserMenu";

const MyAppBar = (props) => <AppBar {...props} userMenu={<MyUserMenu />} />;
export default MyAppBar;
