import React, { Component } from "react";

export default class Tutorialpage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount() {}

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
        <div>
          <section className="section">
            <h1>Hot Reload Interactive Learning Portal</h1>
            <div className="player-wrapper">
              <ReactPlayer
                ref={this.ref}
                className="react-player"
                width="100%"
                height="100%"
                url={url}
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

            <table>
              <tbody>
                {/* <tr>
                <th>Controls</th>
                <td>
                  <button onClick={this.handleStop}>Stop</button>
                  <button onClick={this.handlePlayPause}>
                    {playing ? "Pause" : "Play"}
                  </button>
                  <button onClick={this.handleClickFullscreen}>
                    Fullscreen
                  </button>
                  {light && (
                    <button onClick={() => this.player.showPreview()}>
                      Show preview
                    </button>
                  )}
                  {ReactPlayer.canEnablePIP(url) && (
                    <button onClick={this.handleTogglePIP}>
                      {pip ? "Disable PiP" : "Enable PiP"}
                    </button>
                  )}
                </td>
              </tr> */}
                <tr class="flex adjustSpeedRow">
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
                {/* <tr>
                <th>Seek</th>
                <td>
                  <input
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                  />
                </td>
              </tr> */}
                {/*    
              <tr>
                <th>
                  <label htmlFor="controls">Controls</label>
                </th>
                <td>
                  <input
                    id="controls"
                    type="checkbox"
                    checked={controls}
                    onChange={this.handleToggleControls}
                  />
                  <em>&nbsp; Requires player reload</em>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="muted">Muted</label>
                </th>
                <td>
                  <input
                    id="muted"
                    type="checkbox"
                    checked={muted}
                    onChange={this.handleToggleMuted}
                  />
                </td>
              </tr> */}
                {/* <tr>
                <th>
                  <label htmlFor="loop">Loop</label>
                </th>
                <td>
                  <input
                    id="loop"
                    type="checkbox"
                    checked={loop}
                    onChange={this.handleToggleLoop}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="light">Light mode</label>
                </th>
                <td>
                  <input
                    id="light"
                    type="checkbox"
                    checked={light}
                    onChange={this.handleToggleLight}
                  />
                </td>
              </tr> */}
                <tr>
                  <th>Played</th>
                  <td>
                    <progress max={1} value={played} />
                  </td>
                </tr>
                <tr>
                  <th>Loaded</th>
                  <td>
                    <progress max={1} value={loaded} />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className="section">
            <table>
              <tbody>
                <tr>
              
                  <td>
                    {this.renderLoadButton(
                      "https://www.youtube.com/watch?v=oUFJJNQGwhk",
                      "1. Introduction"
                    )}
                    {this.renderLoadButton(
                      "https://youtu.be/rT5ZWioGqVM",
                      "2. Scraping Assets"
                    )}
                    {this.renderLoadButton(
                      "https://www.youtube.com/watch?v=jNgP6d9HraI",
                      "3. Gathering CSS"
                    )}
                    {this.renderLoadButton(
                      "https://www.youtube.com/watch?v=jNgP6d9HraI",
                      "4. Page Management"
                    )}
                    {this.renderLoadButton(
                      "https://www.youtube.com/watch?v=jNgP6d9HraI",
                      "5. Map Page Management To Local Directory"
                    )}
                    <p>Jump to Hot Reload for Videos Below</p>
                    {this.renderLoadButton(
                      "https://www.youtube.com/playlist?list=PLogRWNZ498ETeQNYrOlqikEML3bKJcdcx",
                      "Playlist"
                    )}
                  </td>
                </tr>
                {/* <tr>
                <th>Custom URL</th>
                <td>
                  <input
                    ref={(input) => {
                      this.urlInput = input;
                    }}
                    type="text"
                    placeholder="Enter URL"
                  />
                  <button
                    onClick={() => this.setState({ url: this.urlInput.value })}
                  >
                    Load
                  </button>
                </td>
              </tr> */}
              </tbody>
            </table>

            <h2>State</h2>

            <table>
              <tbody>
                <tr>
                  <th>url</th>
                  <td className={!url ? "faded" : ""}>
                    {(url instanceof Array ? "Multiple" : url) || "null"}
                  </td>
                </tr>
                <tr>
                  <th>playing</th>
                  <td>{playing ? "true" : "false"}</td>
                </tr>
                <tr>
                  <th>volume</th>
                  <td>{volume.toFixed(3)}</td>
                </tr>
                <tr>
                  <th>played</th>
                  <td>{played.toFixed(3)}</td>
                </tr>
                <tr>
                  <th>loaded</th>
                  <td>{loaded.toFixed(3)}</td>
                </tr>
                <tr>
                  <th>duration</th>
                  <td>
                    <Duration seconds={duration} />
                  </td>
                </tr>
                <tr>
                  <th>elapsed</th>
                  <td>
                    <Duration seconds={duration * played} />
                  </td>
                </tr>
                <tr>
                  <th>remaining</th>
                  <td>
                    <Duration seconds={duration * (1 - played)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </>
    );
  }
}
