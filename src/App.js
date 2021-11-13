import "./App.css";
import { faBell, faEnvelope, faLaughWink, faSearch, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from "react-router";
import { Link, Route, Switch, Redirect, useParams } from "react-router-dom";
function App() {
  //to hide/show the side navbar when the menu button on the top is clicked(for small screens)
  const [navshow, setnavshow] = useState("block");
  return (
    <div className="wholepage">
      {/*hides side nav bar when the menu button is clicked */}
      <div className="nav-bar" style={{ display: navshow }}>
        <Link className="link" to="/Dashboard">
          <div className="nav-items">
            <FontAwesomeIcon icon={faLaughWink} size="2x" /><span>Dashboard</span>
          </div>
        </Link>
        <Link className="link" to="/users">
          <div className="nav-items" >
            <FontAwesomeIcon icon={faList} size="1x" />
            List Users
          </div>
        </Link>
        <hr />
        <div className="procontainer">
          <img className="proimage" src="https://startbootstrap.github.io/startbootstrap-sb-admin-2/img/undraw_rocket.svg" />
          <div>SB Admin Pro is packed with premium features, components, and more!</div>
          <button className="probutton">Upgrade to Pro!</button>
        </div>
      </div>
      {/*creating a menubar on top */}
      <div>
        <div className="topnavbar">
          {/*when menu button is clicked, the side navbar toggles between hide/show. 
              This menu button is not available for large screens and the sidenavbar is always visible */}
          <button className="navtogglebutton" onClick={() => { navshow === "block" ? setnavshow("none") : setnavshow("block") }}><MenuIcon /></button>

          <div className="searchbarNicon">
            <input type="text" placeholder="Search for..." className="topnavsearchbar"></input>
            <button className="topnavbaricon"><FontAwesomeIcon icon={faSearch} className="topnavicon" /></button>
          </div>
          <div className="topnavrightpart">
            <div className="topnavbellicon"><FontAwesomeIcon icon={faBell} /></div>
            <div className="topnavbellicon"><FontAwesomeIcon icon={faEnvelope} /></div>
            <div className="topnavusername">douglas McGee</div>
          </div>
        </div>
        <Routes />

        {/*creating a copyright content at the bottom of screen */}
        <div className="coyrightcontainer">Copyright © Your Website 2021</div>
      </div>

    </div>

  );
}
//route paths
function Routes() {
  return (
    <>
      <div className="container">
        <Switch>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/users">
            <Listusers />
          </Route>

          <Route path="/create-user">
            <Createuser />
          </Route>
          {/* "/:id" is dynamic, which is formed when the corresponding button is clicked */}
          <Route path="/edit-user/:id">
            <Edituser />
          </Route>
          <Route path="/edit-profile/:id">
            <Editprofile />
          </Route>
          <Route exact path="/">
            <Redirect to="/Dashboard" />
          </Route>
        </Switch>
      </div>
    </>
  )
}
//creates the dashboard page 
function Dashboard() {
  return (
    <div className="dashboard-container">
      <Link className="dashboard-content" to="/create-user">Create User</Link><br />
      <Link className="dashboard-content" to="/users">List Users</Link>
    </div>
  )
}
//creates new user
function Createuser() {
  {/*details of new user */ }
  const [newusername, setnewUsername] = useState("");
  const [newuserPic, setnewUserPic] = useState("");
  const [newuserdetails, setnewUserdetails] = useState("");
  //adds the new data to API
  function Addusers() {
    fetch("https://6121377ff5849d0017fb41c6.mockapi.io/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newusername, pic: newuserPic, details: newuserdetails })
    })
  }
  //alerts on screen when the new user is added to API
  function useralert() {
    alert("user added successfully");
  }
  return (
    <div className="new-input-boxes">
      {/* when a value is typed in the input box it creates new user with the typed value*/}
      <input type="text" className="input-box name-input" placeholder="user name..."
        onChange={(event) => setnewUsername(event.target.value)} />

      <input type="text" className="input-box pic-input" placeholder="user image..."
        onChange={(event) => setnewUserPic(event.target.value)} />

      <textarea rows="3" placeholder="user details..." className="input-box"
        onChange={(event) => setnewUserdetails(event.target.value)} />
      {/*user list will be updated by adding the new user details */}
      <button className="input-button" onClick={() => { Addusers(); useralert(); }}>Add User</button><br/>
      <Link className="dashboard-content" to="/users">List Users</Link>

    </div>
  )
}
//lists the users with details
function Listusers() {
  const [newlist, setnewlist] = useState([]);
  const history = useHistory();
  //fetched data from API
  function getUsers() {
    fetch("https://6121377ff5849d0017fb41c6.mockapi.io/users", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((users) => setnewlist(users));
  }
  //deletes the user from API with the id
  function deleteUser(id) {
    fetch(`https://6121377ff5849d0017fb41c6.mockapi.io/users/${id}`, {
      method: "DELETE"
    })
      .then((data) => data.json())
      .then(() => getUsers());
  }
  //To execute only once while loading
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="list-users">
      {newlist.map(({ name, pic, details, id }) =>
        <div className="card">
          <img src={pic} />
          <div className="username">{name}</div>
          <div className="profile">{details}</div>
          <div className="list-buttons">
            {/*routes to the new path with the current id, when edit button is clicked */}
            <button onClick={() => history.push("/edit-user/" + id)}>Edit User</button>
            {/*removes the user with the current id from the list, when delete button is clicked */}
            <button className="delete-button" onClick={() => deleteUser(id)} >Delete User</button><br />
            <button className="profile-button" onClick={() => history.push("/edit-profile/" + id)}>Edit Profile</button>
          </div>
        </div>)}
    </div>
  )
}
//edits the user 
function Edituser() {
  const [newlist, setnewlist] = useState([]);
  {/* takes the id from the dynamic path using the hook useparams */ }
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState("");
  //edits the user in the APi with the id
  function edit(id) {
    fetch(`https://6121377ff5849d0017fb41c6.mockapi.io/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: username, pic: userPic })
    })
      .then((data) => data.json())
      .then(() => getUsers());
  }
  function getUsers() {
    fetch("https://6121377ff5849d0017fb41c6.mockapi.io/users", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((users) => setnewlist(users));
  }
  //alerts on screen when data in API is edited
  function alertuser() {
    alert("user edited successfully");
  }
  return (
    <div className="new-input-boxes">
      {/* user details are changed when the value in the input box changes */}
      <input type="text" placeholder="user name..." className="input-box name-input"
        onChange={(event) => setUsername(event.target.value)} />
      <input type="text" placeholder="user image..." className="input-box pic-input"
        onChange={(event) => setUserPic(event.target.value)} />
      <div>
      </div>
      <button onClick={() => { edit(id); alertuser() }} className="input-button">Edit User</button><br/>
      <Link className="dashboard-content" to="/users">List Users</Link>
    </div>
  )
}
//edits profile details
function Editprofile() {
  {/* takes the id from the dynamic path using the hook useparams */ }
  const { id } = useParams();
  const [userprofile, setUserprofile] = useState("");
  //edits the profile in API with the id
  function edit(id) {
    fetch(`https://6121377ff5849d0017fb41c6.mockapi.io/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ details: userprofile })
    })
//alerts on screen when profile is edited in API
  }
  function alertuser() {
    alert("user profile edited successfully");
  }
  return (
    <div className="profile-page">
      <textarea rows="3" placeholder="user profile..." className="input-box"
        onChange={(event) => setUserprofile(event.target.value)} /><br />
      <button onClick={() => { edit(id); alertuser() }} className="input-button">Edit User profile</button><br/>
      <Link className="dashboard-content" to="/users">List Users </Link>

    </div>
  )

}
export default App;
