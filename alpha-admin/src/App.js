import { React } from "react";
import { PostList } from "./users/pages/Posts";
import { Route } from "react-router-dom";
import MyLayout from "./layout/MyLayout";
import { Admin, Resource, CustomRoutes } from "react-admin";
import AuthProvider from "./users/controllers/AuthProvider";
import { Dashboard } from "./layout/Dashboard";
import SigniInSide from "./users/pages/SignInSide";
import SignUp from "./users/pages/Signup";
import CreateCalendar from "./calendars/pages/CreateCalendar";
import AddEvents from "./calendars/pages/AddEvents";
import EditEvents from "./calendars/pages/EditEvents";
import JoinCalendar from "./calendars/pages/JoinCalendar";
import EditCalendars from "./calendars/pages/EditCalendars";
import ViewDayEvent from "./calendars/pages/ViewDayEvent";
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
    dataProvider={dataProvider}
    checkPermissions={true}>
    {(permissions) => [
      <CustomRoutes>
        {/* <Route exact path="/calendar/:id" element={<SignUp />} /> */}
        <Route exact path="/calendar/:cid" element={<Dashboard />} />
        <Route exact path="/calendar/:cid/date/:date" element={<Dashboard />} />
        <Route exact path="/calendar/new" element={<CreateCalendar />} />
        <Route exact path="/calendar/:cid/event" element={<AddEvents />} />
        <Route exact path="/calendar/:cid/edit" element={<EditEvents />} />
        <Route exact path="/settings" element={<UserSetting />} />
        <Route exact path="/calendar/settings" element={<EditCalendars />} />
        <Route exact path="/join/:uuid" element={<JoinCalendar />} />
      </CustomRoutes>,
      <CustomRoutes noLayout>
        <Route
          exact
          path="/calendar/:cid/event/:date"
          element={<ViewDayEvent />}
        />
      </CustomRoutes>,
    ]}
    <CustomRoutes noLayout>
      <Route exact path="/signup" element={<SignUp />} />
    </CustomRoutes>
  </Admin>
);

export default App;
