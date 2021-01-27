import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { hot } from "react-hot-loader";
import screenfull from "screenfull";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./reset.css";
import "./defaults.css";
import "./range.css";
import "./App.css";
import axios from "axios";
import { version } from "../../package.json";
import ReactPlayer from "../index";
import Duration from "./Duration";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment, { invalid } from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import firebase from "firebase";
import { Animated } from "react-animated-css";
import { Waypoint } from "react-waypoint";
import ReactMarkdown from "react-markdown";
var Scroll = require("react-scroll");
const https = require("https");
var Element = Scroll.Element;
var scroller = Scroll.scroller;

const config = {
  apiKey: "AIzaSyCPWgYYKG2sNsTh7V1orQE4nq7WSlhshvE",
  authDomain: "q4-learning-portal.firebaseapp.com",
  databaseURL: "https://q4-learning-portal.firebaseio.com",
  projectId: "q4-learning-portal",
  storageBucket: "q4-learning-portal.appspot.com",
  messagingSenderId: "865905721928",
  appId: "1:865905721928:web:a4e46e66c53737ba54ce7d",
  measurementId: "G-FC58K3R9C4",
};
firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

const localizer = momentLocalizer(moment);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: true,
      invalidEmail: false,
      discipline: null,
      userInput: "",
      messages: [],
      displayName: null,
      url: "https://youtu.be/KwyehKC-Drs",
      pip: false,
      playing: true,
      controls: true,
      light: false, 
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false,
      playerFullWidth: false,
      // showQandA: true,
      showNotes: false,
      portalSelection: null,
    };

    //creates a reference for your element to use
    this.myDivToFocus = React.createRef();
  }
  handleSetDiscipline = (e, disciplineString) => {
    this.setState({
      discipline: disciplineString,
    });
  };
  handleHomePageState = (e, disciplineString) => {
    this.setState({
      discipline: null,
    });
  };
  handleChange = (event) => {
    // we're telling React to update the state of our `App` component to be
    // equal to whatever is currently the value of the input field
    this.setState({
      userInput: event.target.value,
    });
  };
  handleClick = (event, path) => {
    //event.preventDefault prevents the default action: form submission
    event.preventDefault();

    // here, we create a reference to our database
    const dbRef = firebase
      .database()
      .ref(path ? path : "general-message-board");

    // here we grab whatever value this.state.userInput has and push it to the database
    dbRef.push({
      name: this.state.displayName ? this.state.displayName : "Lorem",
      message: this.state.userInput,
    });

    // here we reset the state to an empty string
    this.setState({
      userInput: "",
    });
  };
  login = () => {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user.email;

      if (user.includes("@q4inc.com")) {
        console.log("contains", this.state.invalidEmail, user);
        this.state.displayName = result.user.displayName;
        console.log(result);
        this.setState({
          user,
          invalidEmail: false,
        });
      } else {
        console.log("invalid", this.state.invalidEmail, user);
        this.setState({
          invalidEmail: true,
        });
      }
    });
  };
  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  };
  handlePortalSelection = (e, portalSelected) => {
    this.setState({
      portalSelection: portalSelected,
    });
  };
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });

    const dbRef = firebase.database().ref("general-message-board");
    // const instance = axios.create({
    //   httpsAgent: new https.Agent({
    //     rejectUnauthorized: false
    //   })
    // });
    // const agent = new https.Agent({
    //   rejectUnauthorized: false
    // });
    // axios.get('https://something.com/foo', { httpsAgent: agent });
    dbRef.on("value", (response) => {
      // Here we're creating a variable to store the new state we want to introduce to our app
      const newState = [];

      // Here we store the response from our query to Firebase inside of a variable called data
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();

      //data is an object, so we iterate through it using a for in loop to access each message name
      for (let key in data) {
        // inside the loop, we push each message name to an array we already created inside the .on() function called newState
        newState.push(data[key]);
      }

      // then, we call this.setState in order to update our component's state using the local array newState
      this.setState({
        messages: newState,
      });
    });
    axios
      .get("https://learning-portal.ngrok.io/learning-portals")
      .then((response) => {
        console.log(response);
        if (response.data.length) {
          this.setState({
            appInfo: response.data,
          });
        }
      });
  }
  render() {
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip,
    } = this.state;
    const SEPARATOR = " · ";
    return (
      <div className="app">
        <Router>
          <div>
            <Animated
              animationIn="fadeInDown"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="0"
            >
              <ul className="flex module__menu">
                <li>
                  <img
                    className="module-logo_white"
                    src="//s25.q4cdn.com/982695397/files/design/logo-white.svg"
                    alt="Q4 Logo"
                  />
                  <p>
                    {this.state.displayName
                      ? this.state.displayName + "'s"
                      : null}
                  </p>
                  <h1>Learning Portal</h1>
                </li>
                <li onClick={this.handleHomePageState}>
                  <Link className="module__menu--link" to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="module__menu--link" to="/hot-reload">
                    Videos Tutorials
                  </Link>
                </li>
                <li>
                  <Link className="module__menu--link" to="/dashboard">
                    Upcoming Lunch and Learns
                  </Link>
                </li>
                {/* <li>
                  <Link className="module__menu--link" to="/live-learning">
                    Lunch and Learn Live
                  </Link>
                </li> */}
                <li>
                  <Link className="module__menu--link" to="/questions">
                    Questions
                  </Link>
                </li>
                <li>
                  {" "}
                  {!this.state.invalidEmail && this.state.user ? (
                    <button onClick={this.logout}>Log Out</button>
                  ) : (
                    <button onClick={this.login}>Log In</button>
                  )}
                </li>
              </ul>
            </Animated>
            {!this.state.user || this.state.invalidEmail ? (
              <Animated
                animationIn="fadeIn"
                animationOut="fadeOut"
                isVisible={true}
                animationInDelay="750"
              >
                <p className="loginPrompt">
                  Please login with a valid Q4 Email.
                </p>
                <button onClick={this.login}>Log In</button>
                <button>
                  <a
                    className="adminLogin"
                    href="https://learning-portal.ngrok.io/admin"
                  >
                    Admin Log In
                  </a>
                </button>
              </Animated>
            ) : (
              <Switch>
                <Route exact path="/">
                  <LandingPage
                    appInfo={this.state.appInfo}
                    handleSetDiscipline={this.handleSetDiscipline}
                    discipline={this.state.discipline}
                    handlePortalSelection={this.handlePortalSelection}
                  />
                </Route>

                <Route path="/portal">
                  <DeveloperLandingPage
                    DisciplineType={
                      this.state.appInfo ? this.state.discipline : null
                    }
                    PortalSelection={this.state.portalSelection}
                    handlePortalSelection={this.handlePortalSelection}
                  />
                </Route>
                <Route exact path="/im">
                  <ImplementationsLandingPage />
                </Route>
                <Route
                  path="/q4/:lorem"
                  name="landing-page-portal"
                  component={DeveloperLandingPage}
                ></Route>
                <Route exact path="/qa">
                  <QALandingPage />
                </Route>
                <Route path="/hot-reload">
                  <Hot
                    displayName={this.state.displayName}
                    messages={this.state.messages}
                    handleChange={this.handleChange}
                    handleClick={this.handleClick}
                    userInput={this.state.userInput}
                  />
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/live-learning">
                  <Dashboard />
                </Route>
                <Route path="/questions">
                  <QuickQs
                    displayName={this.state.displayName}
                    messages={this.state.messages}
                    handleChange={this.handleChange}
                    handleClick={this.handleClick}
                    userInput={this.state.userInput}
                    dbPath="general-message-board"
                  />
                </Route>
              </Switch>
            )}
          </div>
        </Router>
      </div>
    );
  }
}
export default hot(module)(App);
class Hot extends Component {
  state = {
    url: null,
    pip: false,
    playing: true,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    showPlaylist: true,
    showQandA: true,
  };
  load = (url) => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };
  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };
  handleStop = () => {
    this.setState({ url: null, playing: false });
  };
  handleToggleControls = () => {
    const url = this.state.url;
    this.setState(
      {
        controls: !this.state.controls,
        url: null,
      },
      () => this.load(url)
    );
  };
  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };
  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };
  handleVolumeChange = (e) => {
    this.setState({ volume: parseFloat(e.target.value) });
  };
  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };
  handleSetPlaybackRate = (e) => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };
  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };
  handlePlay = () => {
    console.log("onPlay");
    this.setState({ playing: true });
  };
  handleEnablePIP = () => {
    console.log("onEnablePIP");
    this.setState({ pip: true });
  };
  handleDisablePIP = () => {
    console.log("onDisablePIP");
    this.setState({ pip: false });
  };
  handleProgress = (state) => {
    console.log("onProgress", state);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };
  handleDuration = (duration) => {
    console.log("onDuration", duration);
    this.setState({ duration });
  };
  handleClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
  };
  handleShowPlaylist = () => {
    console.log(this.state.playerFullWidth);
    this.setState((prevState) => ({
      showPlaylist: !prevState.showPlaylist,
      playerFullWidth: !prevState.playerFullWidth,
    }));
  };
  handleShowQandA = () => {
    this.setState((prevState) => ({
      showQandA: !prevState.showQandA,
    }));
  };
  renderLoadButton = (url, label) => {
    return (
      <button className="module__video--button" onClick={() => this.load(url)}>
        {label}
      </button>
    );
  };
  ref = (player) => {
    this.player = player;
  };

  render() {
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip,
    } = this.state;
    const SEPARATOR = " · ";

    return (
      <div className="app">
        <div className="flex">
          <section
            className={`section ${
              this.state.playerFullWidth ? "full-width" : "normal-width"
            }`}
          >
            {/* <h1>Hot Reload Interactive </h1> */}

            <Animated
              animationIn="slideInLeft"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="0"
            >
              <div className="player-wrapper">
                <ReactPlayer
                  ref={this.ref}
                  className="react-player"
                  width="100%"
                  height="100%"
                  url={!url ? "https://youtu.be/KwyehKC-Drs" : url}
                  pip={pip}
                  playing={playing}
                  controls={controls}
                  light={light}
                  loop={loop}
                  playbackRate={playbackRate}
                  volume={volume}
                  muted={muted}
                  onReady={() => console.log("onReady")}
                  onStart={() => console.log("onStart")}
                  onPlay={this.handlePlay}
                  onEnablePIP={this.handleEnablePIP}
                  onDisablePIP={this.handleDisablePIP}
                  onPause={this.handlePause}
                  onBuffer={() => console.log("onBuffer")}
                  onSeek={(e) => console.log("onSeek", e)}
                  onEnded={this.handleEnded}
                  onError={(e) => console.log("onError", e)}
                  onProgress={this.handleProgress}
                  onDuration={this.handleDuration}
                />
              </div>
            </Animated>
            <Animated
              animationIn="slideInUp"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="1000"
            >
              <div>
                <ul className="flex module__menu">
                  <li className="internal-nav">
                    <button className="handle" onClick={this.handleShowQandA}>
                      Q and A
                    </button>
                  </li>
                  <li className="internal-nav">
                    <button>Notes</button>
                  </li>
                  <li className="internal-nav">
                    <button>Road Map</button>
                  </li>
                  <li className="internal-nav">
                    <button>Announcements</button>
                  </li>
                  <li className="internal-nav">
                    <button
                      className="handle"
                      onClick={this.handleShowPlaylist}
                    >
                      Toggle Playlist
                    </button>
                  </li>
                </ul>
              </div>
            </Animated>
            {/* <Animated
              animationIn="slideInLeft"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="500"
            >
              <table className="playlist">
                <tbody>
                  <tr className="flex adjustSpeedRow">
                    <td>
                      <button onClick={this.handleSetPlaybackRate} value={1}>
                        1x
                      </button>
                      <button onClick={this.handleSetPlaybackRate} value={1.5}>
                        1.5x
                      </button>
                      <button onClick={this.handleSetPlaybackRate} value={2}>
                        2x
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Animated> */}
          </section>
          <section
            className={`playlist-section ${
              this.state.showPlaylist ? "active" : "hide"
            }`}
          >
            <Animated
              animationIn="slideInRight"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="0"
            >
              <table>
                <tbody>
                  <tr>
                    <td>
                      {/* {this.renderLoadButton(
                    "https://youtu.be/KwyehKC-Drs",
                    "Start Entire Playlist"
                  )} */}
                      {this.renderLoadButton(
                        "https://youtu.be/KwyehKC-Drs",
                        "1. Introduction"
                      )}
                      {this.renderLoadButton(
                        "https://youtu.be/_d9NmQNXBUs",
                        "2. Site Overview"
                      )}
                      {this.renderLoadButton(
                        "https://youtu.be/Im5cBPfNJYo",
                        "3. Scraping Assets"
                      )}
                      {this.renderLoadButton(
                        "https://youtu.be/7-KFEYVNqBU",
                        "4. Uploading Assets"
                      )}
                      {this.renderLoadButton(
                        "https://youtu.be/NNp8x8ZfJ2o",
                        "5. Gathering and Uploading CSS"
                      )}
                      <p>Jump to Hot Reload for Videos Below</p>
                      {this.renderLoadButton(
                        "https://youtu.be/Gc2tkx5OfrI",
                        "6. Lorem"
                      )}
                      {this.renderLoadButton(
                        "https://youtu.be/81j8YXv3xeA",
                        "7. Ipsum"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Animated>
          </section>
        </div>
        {/* {this.state.showQandA ? ( */}
        <div
          className={
            "questionWrapper " + (this.state.showQandA ? "show" : "hidden")
          }
        >
          <Questions
            displayName={this.props.displayName}
            messages={this.props.messages}
            handleChange={this.props.handleChange}
            handleClick={this.props.handleClick}
            userInput={this.props.userInput}
            dbPath="dev-courses/anvil/message-board"
          />
        </div>
        {/* ) : null} */}
      </div>
    );
  }
}
function Questions(props) {
  return (
    <>
      {/* <div class="q-and-a">
        <h1>Pinned Questions</h1>
        <h1>
          Question: Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
          placeat consectetur repudiandae voluptate non, culpa et. Sit cum
          debitis facere laudantium tenetur fugiat provident, eum, sunt quam hic
          ex molestiae?
        </h1>
        <h3>
          Answer: Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
          ab, aliquam eius quasi fugiat magni optio eveniet tempore quaerat
          porro, nulla perferendis earum ullam quis assumenda odio fuga
          dignissimos vitae.
        </h3>
        <h1>
          Question: Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
          placeat consectetur repudiandae voluptate non, culpa et. Sit cum
          debitis facere laudantium tenetur fugiat provident, eum, sunt quam hic
          ex molestiae?
        </h1>
        <h3>
          Answer: Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
          ab, aliquam eius quasi fugiat magni optio eveniet tempore quaerat
          porro, nulla perferendis earum ullam quis assumenda odio fuga
          dignissimos vitae.
        </h3>
      </div> */}
      <QuickQs
        displayName={props.displayName}
        messages={props.messages}
        handleChange={props.handleChange}
        handleClick={props.handleClick}
        userInput={props.userInput}
        dbPath="dev-courses/anvil/message-board"
      />
    </>
  );
}
function LandingPage(props) {
  console.log(props.appInfo)
  // const listItems = props.appInfo.map((item) => <li>{item.App.Name}</li>);
  return (
    <Animated
      animationIn="fadeInUp"
      animationOut="fadeOut"
      isVisible={true}
      animationInDelay="0"
    >
      <div className="homePage">
        {/* {props.appInfo ?props.appInfo.map((discipline) => <li>{discipline.App.Name}</li>) : null} */}
        {props.appInfo && props.discipline === null ? (
          <ul class="masonry-list">
            {props.appInfo.map((item) => (
              <li
                class="tile-job"
                onClick={(e) => {
                  props.handleSetDiscipline(e, item.DisciplineType);
                  props.handlePortalSelection(e, item.PortalContent);
                }}
              >
                {console.log(item)}
                <Link
                  className="module__menu--link"
                  to={`/q4/${item.DisciplineType}`}
                >
                  <div class="tile-primary-content">
                    {/* <h2>Explore Resources On</h2> */}
                    <p>{item.DisciplineType}</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Dev Resources</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Animated>
  );
}

class DeveloperLandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portalContent: [],
      homePage: [],
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount() {
    this.props.match.params.lorem
      ? axios
          .get(
            `https://learning-portal.ngrok.io/learning-portals?DisciplineType=${this.props.match.params.lorem}`
          )
          .then((response) => {
            console.log("test", response);
            if (response.data.length) {
              this.setState({
                portalContent: response.data[0].PortalContent,
                homePage: response.data[0].HomePage,
              });
            }
          })
      : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.name !== this.state.name) {
      this.handler();
    }
  }

  componentWillUnmount() {}

  // Prototype methods, Bind in Constructor (ES2015)
  handleEvent() {}

  // Class Properties (Stage 3 Proposal)
  handler = () => {
    this.setState();
  };

  render() {
    return (
      <>
        <Animated
          animationIn="fadeInUp"
          animationOut="fadeOut"
          isVisible={true}
          animationInDelay="0"
        >
          <ReactMarkdown>
            {this.state.homePage ? this.state.homePage.MostRecentUpdates : null}
          </ReactMarkdown>
          <h2>
            {this.state.homePage ? this.state.homePage.WidgetHallOfFame : null}
          </h2>
          <h2>
            {this.state.homePage ? this.state.homePage.UpcomingEvents : null}
          </h2>
          <ul class="masonry-list">
            {this.state.portalContent
              ? this.state.portalContent.map((item) => (
                  <li class="tile-job">
                    <a href="#">
                      <div class="tile-primary-content">
                        {/* <h2>Explore Resources On</h2> */}
                        <p>{item.Topic}</p>
                      </div>
                      <div class="tile-secondary-content">
                        <p>Go to Resources</p>
                      </div>
                    </a>
                  </li>
                ))
              : null}
          </ul>
        </Animated>
      </>
    );
  }
}

// function DeveloperLandingPage(props) {
//   {
//     props.DisciplineType
//       ? axios
//           .get(
//             `https://learning-portal.ngrok.io/learning-portals?DisciplineType=${props.DisciplineType}`
//           )
//           .then((response) => {
//             console.log("test", response);
//             if (response.data.length) {
//               this.setState({
//                 appInfo: response.data,
//               });
//             }
//           })
//       : null;
//   }

//   return (
//     <Animated
//       animationIn="fadeInUp"
//       animationOut="fadeOut"
//       isVisible={true}
//       animationInDelay="0"
//     >
//       {/* {props.DisciplineType ? (
//         <h1>{props.DisciplineType} Portal</h1>
//       ) : (
//         <h1>nont</h1>
//       )} */}
//       {/* {props.DisciplineType ? <h1>{props.PortalContent.map(item => <h2>{item.Topic}</h2>)} </h1> : <h1>nont</h1> } */}
//       <ul class="masonry-list">
//         {props.PortalSelection
//           ? props.PortalSelection.map((item) => (
//               <li class="tile-job">
//                 <a href="#">
//                   <div class="tile-primary-content">
//                     {/* <h2>Explore Resources On</h2> */}
//                     <p>{item.Topic}</p>
//                   </div>
//                   <div class="tile-secondary-content">
//                     <p>Go to Resources</p>
//                   </div>
//                 </a>
//               </li>
//             ))
//           : null}
//       </ul>
//       </Animated>
//   );
// }

function QALandingPage(props) {
  return (
    <Animated
      animationIn="fadeInUp"
      animationOut="fadeOut"
      isVisible={true}
      animationInDelay="0"
    >
      <div className="homePage">
        <ul class="masonry-list">
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Bugherd</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Bugherd Resources</p>
              </div>
            </a>
          </li>
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Automated Testing</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Automated Testing Resources</p>
              </div>
            </a>
          </li>
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Python</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Python Resources</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </Animated>
  );
}
function ImplementationsLandingPage() {
  return (
    <Animated
      animationIn="fadeInUp"
      animationOut="fadeOut"
      isVisible={true}
      animationInDelay="0"
    >
      <div className="homePage">
        <ul class="masonry-list">
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Mavenlink</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Mavenlink Resource</p>
              </div>
            </a>
          </li>
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Asana</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Asana Resource</p>
              </div>
            </a>
          </li>
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Studio CMS</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Studio CMS Resource</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </Animated>
  );
}
function Dashboard() {
  return (
    <Animated
      animationIn="fadeInUp"
      animationOut="fadeOut"
      isVisible={true}
      animationInDelay="0"
    >
      <div className="calendarWrapper">
        <Calendar
          localizer={localizer}
          events={[
            {
              title: "Hot Reload by Jonathan",
              allDay: false,
              start: new Date(2020, 9, 16, 12, 0), // 10.00 AM
              end: new Date(2020, 9, 16, 16, 0), // 2.00 PM
            },
            {
              title: "Jquery UI by Chris",
              allDay: false,
              start: new Date(2020, 9, 23, 12, 0), // 10.00 AM
              end: new Date(2020, 9, 23, 16, 0), // 2.00 PM
            },
          ]}
          // step={120}
          // view='month'
          // views={['month']}
          // min={new Date(2019, 0, 1, 8, 0)} // 8.00 AM
          // max={new Date(2021, 0, 1, 17, 0)} // Max will be 6.00 PM!
          // date={new Date(2020, 9, 23, 14, 0)}
          style={{ height: 650 }}
        />
      </div>
    </Animated>
  );
}

class QuickQs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleInput: false,
      messages: [],
    };
  }

  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };
  _handleWaypointEnter = () => {
    this.setState((prevState) => ({
      visibleInput: !prevState.visibleInput,
    }));
  };
  _handleWaypointLeave = () => {
    this.setState((prevState) => ({
      visibleInput: !prevState.visibleInput,
    }));
  };
  componentDidMount() {
    const dbRef = firebase.database().ref(this.props.dbPath);

    dbRef.on("value", (response) => {
      const newState = [];

      const data = response.val();

      for (let key in data) {
        newState.push(data[key]);
      }

      this.setState({
        messages: newState,
      });
    });
  }
  render() {
    return (
      <div className="helpCueWrapper">
        <Animated
          animationIn="fadeInUp"
          animationOut="fadeOut"
          isVisible={true}
          animationInDelay="0"
        >
          {this.state.messages.length ? (
            <Animated
              animationIn="fadeInUp"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="1000"
            >
              <Waypoint
                onEnter={this._handleWaypointEnter}
                onLeave={this._handleWaypointLeave}
              >
                <ul className="helpCueBackground">
                  {this.state.messages.map((message, i) => {
                    return (
                      <>
                        <li>
                          <p className="flex">
                            <span>{message.name} </span>{" "}
                            <span>{message.message}</span>
                          </p>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </Waypoint>
              <form
                className={
                  "module__message-form "
                  // + (this.state.visibleInput ? "show" : "hidden")
                }
              >
                {/* <label htmlFor="newMessage">{props.displayName}</label> */}
                <input
                  type="text"
                  id="newMessage"
                  onChange={this.props.handleChange}
                  value={this.props.userInput}
                />

                <button
                  id="newMessageSubmit"
                  onClick={(e) => this.props.handleClick(e, this.props.dbPath)}
                >
                  Message
                </button>
              </form>{" "}
            </Animated>
          ) : null}
        </Animated>
      </div>
    );
  }
}
