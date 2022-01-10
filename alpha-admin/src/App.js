import * as React from "react";
import { PostList, PostEdit, PostCreate } from "./users/pages/Posts";
import PostIcon from "@mui/icons-material/Book";
import { Route } from "react-router-dom";

import MyLayout from "./layout/MyLayout";

import { Admin, Resource, CustomRoutes } from "react-admin";
import AuthProvider from "./users/controllers/AuthProvider";
import { Dashboard } from "./layout/Dashboard";
import SigniInSide from "./users/pages/SignInSide";
import SignUp from "./users/pages/Signup";
import CreateCalendar from "./calendars/pages/CreateCalendar";

import jsonServerProvider from "ra-data-json-server";
import UserSetting from "./users/pages/UserSetting";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const App = () => (
  <Admin
    layout={MyLayout}
    loginPage={SigniInSide}
    title={process.env.REACT_APP_TITLE}
    dashboard={Dashboard}
    authProvider={AuthProvider}
    dataProvider={dataProvider}>
    <CustomRoutes>
      <Route exact path="/calendar/new" element={<CreateCalendar />} />
      <Route exact path="/calendar/:id" element={<SignUp />} />
      <Route exact path="/calendar/:id/new" element={<SignUp />} />
      <Route exact path="/calendar/:id/:date" element={<SignUp />} />
      <Route exact path="/settings" element={<UserSetting />} />
    </CustomRoutes>
    <CustomRoutes noLayout>
      <Route exact path="/signup" element={<SignUp />} />
    </CustomRoutes>
    <Resource name="posts" list={PostList} />
  </Admin>
);

export default App;
