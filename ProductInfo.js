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

import xml2js from 'xml2js';
import xmlmerge from 'xmlmerge';

var utils = require('./lib/utils');
var DWText = require('./DWText');
var DWButton = require('./DWButton');

class ProductInfo extends Component {
  // initialization
  constructor(props) {
    super(props);
    this.state = {
      template: null,
      loaded: false
    };
  }

  loadComponent() {
    var productInfo = this;

    fetch(this.props.templateUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }})
        .then((response) => response.text())
        .then((responseText) => {
          this.setState({
            template: responseText,
            loaded: true
          });
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
  }

  getStateValue(path) {
    let parts = path.split('.');
    let value = this.props;
    for (let i = 0; i < parts.length; i++) {
      value = value[parts[i]];
    }
    return value;
  }

  readTemplateLine(line, index) {
      let parts = line.split(':', 3);
      let valuePath = parts[0];
      let componentType = parts[1];
      let styleName = parts[2];
      let cType = null, properties = {};

      switch(componentType) {
        case 'text':
          cType = DWText;
        break;
        case 'button':
          cType = DWButton;
        break;
      }

      properties.key = index;
      properties.style = styles[styleName];
      properties.value = this.getStateValue(valuePath);

      return {cType: cType, properties: properties};
  }

  evaluateDisplayCondition(displayCondition) {
    if (displayCondition) {
      if (displayCondition == "false" || displayCondition == "0" || displayCondition == 0) {
        return false;
      }
      if (displayCondition != "true" || displayCondition != "1" || displayCondition != 1) {
        displayCondition = Boolean(this.getStateValue(displayCondition));
        if (!displayCondition) {
          return false;
        }
      }
    }

    return true;
  }

  assembleView(result) {
    var styleName, displayCondition, valuePath, contents, children = [], keyCounter = 0;

    for (var componentType in result) {
      if (componentType == '$') {
        continue;
      }

      contents = result[componentType];
      var arrayMode = Array.isArray(contents);
      var length = (arrayMode ? contents.length : 1);

      for (var i = 0; i < length; i++) {
        var item = (arrayMode ? contents[i] : contents);
        styleName = item && item.$ && item.$.style ? item.$.style : null;

        displayCondition = item && item.$ && item.$.displayCondition ? item.$.displayCondition : null;
        if (!evaluateDisplayCondition(displayCondition)) {
          continue;
        }

        switch(componentType) {
          case 'View':
            var viewChildren = this.assembleView(item);
            children.push(React.createElement(View, {key: keyCounter, style: styles[styleName]}, viewChildren));
          break;
          case 'Text':
            valuePath = item._;
            children.push(React.createElement(DWText, {key: keyCounter, style: styles[styleName], value: this.getStateValue(valuePath)}));
          break;
          case 'Button':
            valuePath = item._;
            children.push(React.createElement(DWButton, {key: keyCounter, style: styles[styleName], value: this.getStateValue(valuePath)}));
          break;
        }
        keyCounter++;
      }
    }

    return children;
  }

  render() {
    if (!this.state.loaded) { // needs to be preloaded
      this.loadComponent();
      return (<View/>);
    }

    var res;
    xml2js.parseString(this.state.template, (err, result) => {
        console.log(JSON.stringify(result));
        res = this.assembleView(result);
    });

    if (res.length == 1) {
      return (res[0]);
    }
    return (<View>{res}</View>);
  }
}

var styles = require('./styles');

module.exports = ProductInfo;
