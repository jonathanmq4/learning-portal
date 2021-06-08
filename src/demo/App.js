import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { hot } from "react-hot-loader";
import screenfull from "screenfull";
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
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
      showSpeedToggles: false,
      showNotes: false,
      portalSelection: null,
      courseSelectionObject: null,
      dbState: null,
      courseSelectionView: false,
      udemyMode: false
    };

    //creates a reference for your element to use
    this.myDivToFocus = React.createRef();
  }
  handleCourseSelectionView = (e) => {
    // console.log(e)
    // alert(this.state.courseSelectionView)
    this.setState((prevState) => ({
      courseSelectionView: !prevState.courseSelectionView,
    }));
  }
  handleUdemyMode = (e) => {
    this.setState((prevState) => ({
      udemyMode: !prevState.udemyMode,
    }));
  }
  handleResetViews = () => {
    this.setState((prevState) => ({
      courseSelectionView: false,
      udemyMode: false
    }));
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
  handleCourseSelection = (event) => {
    console.log(event.target.dataset.value)
    var path = event.target.dataset.value
    //event.preventDefault prevents the default action: form submission
    event.preventDefault();



    const dbRef = firebase.database().ref("dev-courses/" + path)
    dbRef.on("value", (response) => {
      const newState = [];

      // Here we store the response from our query to Firebase inside of a variable called data
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();
      console.log('data', data)
      //data is an object, so we iterate through it using a for in loop to access each message name
      for (let key in data) {
        // inside the loop, we push each message name to an array we already created inside the .on() function called newState
        newState.push(data[key]);
      }

      // then, we call this.setState in order to update our component's state using the local array newState
      console.log('newstate', newState)
      this.setState({
        courseSelectedObject: newState,
      });
    });


  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });

    const dbRef = firebase.database().ref("/");
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
        dbState: newState,
        discipline: newState[1]
      });
      console.log(this.state.dbState)
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
  // componentDidUpdate() {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       this.setState({ user });
  //     }
  //   });

  //   const dbRef = firebase.database().ref("/");
  //   dbRef.on("value", (response) => {
  //     // Here we're creating a variable to store the new state we want to introduce to our app
  //     const newState = [];

  //     // Here we store the response from our query to Firebase inside of a variable called data
  //     // .val() is a Firebase method that gets us the information we want
  //     const data = response.val();
  //     //data is an object, so we iterate through it using a for in loop to access each message name
  //     for (let key in data) {
  //       // inside the loop, we push each message name to an array we already created inside the .on() function called newState
  //       newState.push(data[key]);
  //     }

  //     // then, we call this.setState in order to update our component's state using the local array newState
  //     this.setState({
  //       dbState: newState,
  //       discipline: newState[1]
  //     });
  //     console.log(this.state.dbState)
  //   });
  //   axios
  //     .get("https://learning-portal.ngrok.io/learning-portals")
  //     .then((response) => {
  //       console.log(response);
  //       if (response.data.length) {
  //         this.setState({
  //           appInfo: response.data,
  //         });
  //       }
  //     });
  // }
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
                  <Link className="module__menu--link" to="/" onClick={this.handleResetViews}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link data-value="video-player" onClick={this.handleResetViews} className="module__menu--link" to="/video-player">
                    Videos Tutorials
                  </Link>
                </li>
                <li>
                  <Link className="module__menu--link" onClick={this.handleResetViews} to="/dashboard">
                    Upcoming Learning Sessions
                  </Link>
                </li>
                {/* <li>
                  <Link className="module__menu--link" to="/live-learning">
                    Lunch and Learn Live
                  </Link>
                </li> */}
                <li>
                  <a href="https://q4-reddit.firebaseapp.com/" className="module__menu--link">Spicy Q's</a>
                </li>
                {/* <Link className="module__menu--link" to="/questions">
                     Process Questions
                </Link> */}
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
                    dbState={this.state.dbState}
                    discipline={this.state.discipline}
                    handleCourseSelectionView={this.handleCourseSelectionView}
                    courseSelectionView={this.state.courseSelectionView}
                    handleUdemyMode={this.handleUdemyMode}
                    udemyMode={this.state.udemyMode}
                  />
                </Route>
                <Route exact path="/:dynamic">
                  <LandingPage
                    appInfo={this.state.appInfo}
                    handleSetDiscipline={this.handleSetDiscipline}
                    discipline={this.state.discipline}
                    handlePortalSelection={this.handlePortalSelection}
                    dbState={this.state.dbState}
                    discipline={this.state.discipline}
                    handleCourseSelectionView={this.handleCourseSelectionView}
                    courseSelectionView={this.state.courseSelectionView}
                    handleUdemyMode={this.handleUdemyMode}
                    udemyMode={this.state.udemyMode}
                  />
                </Route>
                <Route exact path="/:dynamic/:secondLevel">
                  <LandingPage
                    appInfo={this.state.appInfo}
                    handleSetDiscipline={this.handleSetDiscipline}
                    discipline={this.state.discipline}
                    handlePortalSelection={this.handlePortalSelection}
                    dbState={this.state.dbState}
                    discipline={this.state.discipline}
                    handleCourseSelectionView={this.handleCourseSelectionView}
                    courseSelectionView={this.state.courseSelectionView}
                    handleUdemyMode={this.handleUdemyMode}
                    udemyMode={this.state.udemyMode}
                  />
                </Route>
                <Route exact path="/developers">
                  <DeveloperLandingPage
                    DisciplineType={
                      this.state.appInfo ? this.state.discipline : null
                    }
                    PortalSelection={this.state.portalSelection}
                    handlePortalSelection={this.handlePortalSelection}
                    courseSelectionObject={this.state.courseSelectedObject}
                    handleCourseSelection={this.handleCourseSelection}
                    dbState={this.state.dbState}
                    discipline={this.state.discipline}
                  />
                </Route>
                <Route exact path="/content">
                  <ContentLandingPage />
                </Route>
                <Route
                  path="/developer"
                  name="landing-page-portal"
                  component={DeveloperLandingPage}
                  dbState={this.state.dbState}
                ></Route>
                <Route exact path="/qa">
                  <QALandingPage />
                </Route>
                <Route path="/video-player">
                  <Hot
                    displayName={this.state.displayName}
                    messages={this.state.messages}
                    handleChange={this.handleChange}
                    handleClick={this.handleClick}
                    userInput={this.state.userInput}
                    courseSelectionObject={this.state.courseSelectedObject}
                    handleCourseSelection={this.handleCourseSelection}
                    dbState={this.state.dbState}
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
                    dbState={this.state.dbState}
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
    showSpeedToggles: false,
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
  componentDidMount() {
    console.log('mountedd')
    console.log('video-player mounted', this.props.courseSelectionObject)
  }
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

    this.setState((prevState) => ({
      showPlaylist: !prevState.showPlaylist,
      playerFullWidth: !prevState.playerFullWidth,
    }));
  };
  handleShowSpeedToggles = () => {
    console.log(this.state.showSpeedToggles);
    this.setState((prevState) => ({
      showSpeedToggles: !prevState.showPlaylist,
      showSpeedToggles: !prevState.showSpeedToggles,
    }));
    setTimeout(() => {
      this.setState((prevState) => ({
        showSpeedToggles: !prevState.showPlaylist,
        showSpeedToggles: !prevState.showSpeedToggles,
      }));
    }, 5000)
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
            className={`section ${this.state.playerFullWidth ? "full-width" : "normal-width"
              }`}
          >
            <h1>{this.props.courseSelectionObject ? `${this.props.courseSelectionObject[0]}` : null}</h1>

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
                    <button
                      onClick={this.handleShowSpeedToggles}
                    >
                      Adjust Speed</button>
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
            <Animated
              animationIn="slideInLeft"
              animationOut="fadeOut"
              isVisible={true}
              animationInDelay="500"
            >
              <table className={`playlist ${this.state.showSpeedToggles ? "active" : "hide"
                }`} >
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
            </Animated>
          </section>
          <section
            className={`playlist-section ${this.state.showPlaylist ? "active" : "hide"
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
  const { dynamic } = useParams()
  const { secondLevel } = useParams()
  console.log('id', dynamic)
  console.log('secondLevel', secondLevel)


  let disciplineName;
  let discipline;
  // props.dbPath.discipline.forEach((item))
  props.dbState ? disciplineName = Object.keys(props.dbState[1]) : null
  if (props.udemyMode) {
    return <>
      udemy mode
      <Hot
     
      />
    </>
  }
  if (props.courseSelectionView && props.dbState) {
    console.log('discipline name', disciplineName)
    disciplineName.forEach((item, i) => {
      console.log(item, dynamic)
      if (item.toLowerCase().trim() === dynamic) {
        discipline = props.dbState[1][item]
        console.log('discipline', dynamic)

        console.log('list', discipline)
        return (
          <><div>hello world</div></>
        )
      }
    })
  } else {
    return (
      <Animated
        animationIn="fadeInUp"
        animationOut="fadeOut"
        isVisible={true}
        animationInDelay="0"
      >
        <div className="homePage">

          <ul className="masonry-list">
            {props.dbState ?
              // props.dbState[1].map(item => {
              //   return (item)
              // })
              disciplineName.map(item => {
                return (
                  <li className="tile-job" data-tag='test' onClick={() => {
                    props.handleCourseSelectionView()
                  }}>
                    <Link to={`/${item.toLowerCase()}`} className="module__menu--link">
                      <div class="tile-primary-content">
                        <p>{item} Resources</p>
                      </div>
                      <div class="tile-secondary-content">
                        <p>Go to {item} Resources</p>
                      </div>
                    </Link>
                  </li>
                )
              })

              : null}

          </ul>
        </div>
      </Animated>
    );
  }
  return (
    <>
      {props.courseSelectionView && props.dbState ? <div>
        <div className="homePage">
          <ul className="masonry-list">
            {discipline.Courses.map(item => {
              return (
                <li className="tile-job" onClick={props.handleUdemyMode}>
                  <Link to={`${dynamic}/${item.name}`} className="module__menu--link">
                    <div class="tile-primary-content">
                      <p>{item.name} Resources</p>
                    </div>
                    <div class="tile-secondary-content">
                      <p>Go to {item.name} Resources</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div> : 'Loading'}
    </>
  )





}

class DeveloperLandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portalContent: [],
      homePage: [],
      portalSelection: null,
      courseSelectionObject: null
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  handleCourseSelection = (event) => {
    console.log(event.target.dataset.value)
    var path = event.target.dataset.value
    //event.preventDefault prevents the default action: form submission
    event.preventDefault();



    const dbRef = firebase.database().ref("dev-courses/" + path)
    dbRef.on("value", (response) => {
      const newState = [];

      // Here we store the response from our query to Firebase inside of a variable called data
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();
      console.log('data', data)
      //data is an object, so we iterate through it using a for in loop to access each message name
      for (let key in data) {
        // inside the loop, we push each message name to an array we already created inside the .on() function called newState
        newState.push(data[key]);
      }

      // then, we call this.setState in order to update our component's state using the local array newState
      console.log('newstate', newState)
      this.setState({
        courseSelectedObject: newState,
      });
    });


  }

  componentDidMount() {
    console.log(this.props)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.name !== this.state.name) {
      this.handler();
    }
  }

  componentWillUnmount() { }

  // Prototype methods, Bind in Constructor (ES2015)
  handleEvent() { }

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
          animationInDelay="00"
        >
          <h1>Welcome to the Developer Portal</h1>
          <div className="homePage">
            <ul class="masonry-list">
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Introductory Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Introductory Training Resources</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>CMS Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to CMS Training Resources</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>SPAC Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to SPAC Resources</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Studio One Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Studio One Resources</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Studio Plus Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Studio Plus Resources</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Studio Custom Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Studio Custom Resources</p>
                  </div>
                </a>
              </li>
              {/* <li class="tile-job">
                <Link to="/video-player">
                  <div class="tile-primary-content">
                    <p>Hot Reload Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Hot Reload Training Resources</p>
                  </div>
                </Link>
              </li> */}
              {/* <li class="tile-job">
                <Link to="/video-player">
                  <div class="tile-primary-content">
                    <p>Building a Navigation</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Building a Navigation Resources</p>
                  </div>
                </Link>
              </li> */}
              <li class="tile-job">
                <Link to="/video-player" >
                  <div class="tile-primary-content">
                    <p>Common Bugs</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Common Bugs Resources</p>
                  </div>
                </Link>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Lunch and Learn Recordings</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Lunch and Learn Recordings</p>
                  </div>
                </a>
              </li>

              <li class="tile-job" data-value="video-player" onClick={this.handleCourseSelection.bind(this)}>
                <Link to="/video-player" >
                  <div class="tile-primary-content">
                    <p>Hot Reload</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Hot Reload Resources</p>
                  </div>
                </Link>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Accessibility Training</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Accessibility Resources</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>The Wonderful World of Figma</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to The Wonderful World of Figma</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Dev, QA, Content Huddle Past Meetings</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Dev, QA, Content Huddle Past Meetings</p>
                  </div>
                </a>
              </li>
              <li class="tile-job">
                <a href="#">
                  <div class="tile-primary-content">
                    <p>Github</p>
                  </div>
                  <div class="tile-secondary-content">
                    <p>Go to Githu</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
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
      <h1>Welcome to the QA Portal</h1>
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
                <p>Accessibility</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Accessibility Resources</p>
              </div>
            </a>
          </li>
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Common Bugs</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Common Bugs Resources</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </Animated>
  );
}
function ContentLandingPage() {
  return (
    <Animated
      animationIn="fadeInUp"
      animationOut="fadeOut"
      isVisible={true}
      animationInDelay="0"
    >
      <h1>Welcome to the Content Portal</h1>
      <div className="homePage">
        <ul class="masonry-list">

          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Project Sheet Resources</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Project Sheet Resources</p>
              </div>
            </a>
          </li>
          <li class="tile-job">
            <a href="#">
              <div class="tile-primary-content">
                <p>Content Resources</p>
              </div>
              <div class="tile-secondary-content">
                <p>Go to Content Resources</p>
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
              title: "Apollo Accessibility Training",
              allDay: false,
              start: new Date(2021, 5, 3, 15, 30), // 10.00 AM
              end: new Date(2021, 5, 3, 15, 0), // 2.00 PM
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
      <div className={`helpCueWrapper ${this.state.playerFullWidth ? "full-width" : null
        }`} >
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
