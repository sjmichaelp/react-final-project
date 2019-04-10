'use strict';

import React, {Component} from 'react';
import {View, PanResponder} from 'react-native';

export const swipeDirections = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT',
  SWIPE_DOWN_LEFT: 'SWIPE_DOWN_LEFT',
  SWIPE_UP_RIGHT: 'SWIPE_UP_RIGHT',
  SWIPE_DOWN_RIGHT: 'SWIPE_DOWN_RIGHT',
  SWIPE_UP_LEFT: 'SWIPE_UP_LEFT'
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
  gestureIsClickThreshold: 5
};

function isValidSwipe(velocity, velocityThreshold, directionalOffset, directionalOffsetThreshold) {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
}

class GestureRecognizer extends Component {

  constructor(props, context) {
    super(props, context);
    this.swipeConfig = Object.assign(swipeConfig, props.config);
  }

  componentWillReceiveProps(props) {
    this.swipeConfig = Object.assign(swipeConfig, props.config);
  }

  componentWillMount() {
    const responderEnd = this._handlePanResponderEnd.bind(this);
    const shouldSetResponder = this._handleShouldSetPanResponder.bind(this);
    this._panResponder = PanResponder.create({ //stop JS beautify collapse
      onStartShouldSetPanResponder: shouldSetResponder,
      onMoveShouldSetPanResponder: shouldSetResponder,
      onPanResponderRelease: responderEnd,
      onPanResponderTerminate: responderEnd
    });
  }

  _handleShouldSetPanResponder(evt, gestureState) {
    return evt.nativeEvent.touches.length === 1 && !this._gestureIsClick(gestureState);
  }
  
  _gestureIsClick(gestureState) {
    return Math.abs(gestureState.dx) < swipeConfig.gestureIsClickThreshold
      && Math.abs(gestureState.dy) < swipeConfig.gestureIsClickThreshold;
  }

  _handlePanResponderEnd(evt, gestureState) {
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  }

  _triggerSwipeHandlers(swipeDirection, gestureState) {
    const {onSwipe, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeDownLeft, onSwipeUpRight, onSwipeDownRight, onSwipeUpLeft} = this.props;
    const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN, SWIPE_DOWN_LEFT, SWIPE_UP_RIGHT, SWIPE_DOWN_RIGHT, SWIPE_UP_LEFT} = swipeDirections;
    onSwipe && onSwipe(swipeDirection, gestureState);
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
      case SWIPE_UP:
        onSwipeUp && onSwipeUp(gestureState);
        break;
      case SWIPE_DOWN:
        onSwipeDown && onSwipeDown(gestureState);
        break;
      case SWIPE_DOWN_LEFT:
        onSwipeDownLeft && onSwipeDownLeft(gestureState);
        break;
      case SWIPE_UP_RIGHT:
        onSwipeUpRight && onSwipeUpRight(gestureState);
        break;
      case SWIPE_DOWN_RIGHT:
        onSwipeDownRight && onSwipeDownRight(gestureState);
        break;
      case SWIPE_UP_LEFT:
        onSwipeUpLeft && onSwipeUpLeft(gestureState);
        break;
    }
  }

  _getSwipeDirection(gestureState) {
    const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN, SWIPE_DOWN_LEFT, SWIPE_UP_RIGHT, SWIPE_DOWN_RIGHT, SWIPE_UP_LEFT} = swipeDirections;
    const {dx, dy, vx, vy} = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return (dx > 0)
        ? SWIPE_RIGHT
        : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return (dy > 0)
        ? SWIPE_DOWN
        : SWIPE_UP;
    } else if (this._isValidDiagonalSwipe(gestureState)) {
      if (dx < 0 && dy > 0) {
        return SWIPE_DOWN_LEFT;
      } else if (dx > 0 && dy < 0) {
        return SWIPE_UP_RIGHT;
      } else if (dx < 0 && dy < 0) {
        return SWIPE_UP_LEFT;
      } else if (dx > 0 && dy > 0) {
        return SWIPE_DOWN_RIGHT;
      }
    }
    return null;
  }

  _isValidHorizontalSwipe(gestureState) {
    const {vx, dy} = gestureState;
    const {velocityThreshold, directionalOffsetThreshold} = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  }

  _isValidVerticalSwipe(gestureState) {
    const {vy, dx} = gestureState;
    const {velocityThreshold, directionalOffsetThreshold} = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  }

  _isValidDiagonalSwipe(gestureState) {
    const {vy, dx, vx, dy} = gestureState;
    const {velocityThreshold, directionalOffsetThreshold} = this.swipeConfig;
    return true;
  }

  render() {
    return (<View {...this.props} {...this._panResponder.panHandlers}/>);
  }
};

export default GestureRecognizer;
