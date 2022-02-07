import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import MainPage from "pages/MainPage.js";

export default function MainLayout() {
  return (
    <>
      <div>
        {/* <AdminNavbar /> */}
        {/* Header */}
        <div className="">
          <Switch>
            <Route path="/main/" exact component={MainPage} />
            <Redirect from="/" to="/main/" />
          </Switch>
        </div>
      </div>
    </>
  );
}
