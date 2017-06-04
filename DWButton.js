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
  TouchableHighlight
} from 'react-native';

class DWButton extends Component {
  render() {
    return (
        <TouchableHighlight style={this.props.buttonStyle} onPress={this.props.handler.bind(this)}>
          <View>
            <Text style={this.props.buttonTextStyle}>{this.props.children}</Text>
          </View>
        </TouchableHighlight>
      );
  }
}

var styles = require('./styles');

module.exports = DWButton;
