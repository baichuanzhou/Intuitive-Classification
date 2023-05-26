import React, { Component } from "react";

class Play extends Component {
  state = {
    mouseOver: false,
    clicked: false,
    focus: false
  };

  handleHover = state => {
    this.setState({
      mouseOver: state,
      focus: !state ? false : this.state.focus
    });
  };

  handleFocus = state => {
    this.setState({
      focus: state
    });
  };

  handleClick = () => {
    this.setState({
      clicked: !this.state.clicked
    });

    if (this.props.onClick) {
      this.props.onClick(!this.state.clicked);
    }
  };

  render() {
    const state = this.state;
    const strokeColor = "#9b00b7";
    const fillColor = "#fff";
    const size = 200;
    const dashArray = 110;
    const dashOffset = state.mouseOver ? 0 : dashArray;
    const shadowSm = size / 20;
    const shadowMd = size / 10;
    const shadowLg = size / 5;
    const cubicBezier = "cubic-bezier(0.77, 0, 0.175, 1)";

    let boxShadow = `0px 0px 0px 0px ${strokeColor}10, 
                      0px 0px 0px 0px ${strokeColor}10`;

    if (state.mouseOver && !state.focus && !state.clicked) {
      boxShadow = `0px 0px 0px ${shadowMd}px ${strokeColor}50, 
                    0px 0px 0px ${shadowLg}px ${strokeColor}50`;
    }

    if (state.mouseOver && state.focus && !state.clicked) {
      boxShadow = `0px 0px 0px ${shadowSm}px ${strokeColor}50, 
                    0px 0px 0px ${shadowMd}px ${strokeColor}50`;
    }

    const containerStyles = {
      width: size,
      height: size,
      borderRadius: "50%",
      cursor: "pointer",
      userSelect: "none",
      transition: !this.state.focus
        ? `all 750ms ${cubicBezier}`
        : `all 300ms ${cubicBezier}`,
      boxShadow: boxShadow
    };

    const iconStyle = {
      width: "100%",
      height: "100%",
      userSelect: "none"
    };

    const pathStyle = {
      fill: "none",
      transition: `all 1000ms ${cubicBezier}`,
      stroke: strokeColor,
      strokeDasharray: dashArray,
      strokeDashoffset: dashOffset,
      strokeWidth: 6,
      strokeMiterlimit: 10,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      userSelect: "none"
    };

    return (
      <div
        className="PlayIcon-container"
        style={containerStyles}
        onMouseEnter={() => this.handleHover(true)}
        onMouseLeave={() => this.handleHover(false)}
        onMouseDown={() => this.handleFocus(true)}
        onMouseUp={() => this.handleFocus(false)}
        onClick={() => this.handleClick()}
      >
        <svg className="PlayIcon" viewBox="0 0 80 80" style={iconStyle}>
          <path
            className="PlayFill"
            style={pathStyle}
            d="M29,68.3 29.5,22.5 60.3,40.8 37.4,56.1"
          />
          <path
            className="PlayBg"
            fill={fillColor}
            d="M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm22.2 42.3L39.9 56.6c-.8.5-2 .3-2.5-.5s-.3-2 .5-2.5l19.8-12.7-26.9-16v36.6c0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8V21.7c0-.7.4-1.3.9-1.6.6-.3 1.3-.3 1.8 0l32.2 19.1c.6.4.9 1 .9 1.6.1.6-.3 1.2-.8 1.5z"
          />
        </svg>
      </div>
    );
  }
}

export default Play;