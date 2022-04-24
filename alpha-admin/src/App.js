import { React } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import MyLayout from "./layout/MyLayout";
import { Admin, CustomRoutes, Resource, Authenticated } from "react-admin";
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
import UserSetting from "./users/pages/UserSetting";
import jsonServerProvider from "ra-data-json-server";

const App = () => (
  <BrowserRouter>
    <Admin
      layout={MyLayout}
      loginPage={SigniInSide}
      title={process.env.REACT_APP_TITLE}
      dashboard={Dashboard}
      authProvider={AuthProvider}
      dataProvider={jsonServerProvider("https://jsonplaceholder.typicode.com")}>
      <CustomRoutes>
        <Route
          path="/calendar/:cid"
          element={
            <Authenticated>
              <Dashboard />
            </Authenticated>
          }
        />
        <Route
          path="/calendar/:cid/date/:date"
          element={
            <Authenticated>
              <Dashboard />
            </Authenticated>
          }
        />
        <Route
          path="/calendar/new"
          element={
            <Authenticated>
              <CreateCalendar />
            </Authenticated>
          }
        />
        <Route
          path="/calendar/:cid/event"
          element={
            <Authenticated>
              <AddEvents />
            </Authenticated>
          }
        />
        <Route
          path="/calendar/:cid/edit"
          element={
            <Authenticated>
              <EditEvents />
            </Authenticated>
          }
        />
        <Route
          path="/settings"
          element={
            <Authenticated>
              <UserSetting />
            </Authenticated>
          }
        />
        <Route
          path="/calendar/settings"
          element={
            <Authenticated>
              <EditCalendars />
            </Authenticated>
          }
        />
        <Route
          path="/join/:uuid"
          element={
            <Authenticated>
              <JoinCalendar />
            </Authenticated>
          }
        />
      </CustomRoutes>
      <CustomRoutes noLayout>
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/calendar/:cid/event/:date"
          element={
            <Authenticated>
              <ViewDayEvent />
            </Authenticated>
          }
        />
      </CustomRoutes>
      <Resource />
    </Admin>
  </BrowserRouter>
);

export default App;
