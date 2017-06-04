/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

class DWText extends Component {
  render() {
    return (<Text style={this.props.style}>{this.props.value}</Text>);
  }
}

var styles = require('./styles');

module.exports = DWText;
