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

var DWText = require('./DWText');
var DWButton = require('./DWButton');

class DynamicComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: null,
      customTemplate: null,
      mergedTemplate: null,
      loaded: false
    };
  }

  // template/style loading
  mergeTemplates() {
    xmlmerge.merge(this.state.template, this.state.customTemplate, (xml) => {
      this.setState({mergedTemplate: xml});
    });
  }

  /*
  readFile(filePath, handler) {
    fs.exists(filePath, (exists) => {
      exists && fs.readFile(filePath, handler);
    });
  }

  loadFile(filePath) {
    var index = filePath.lastIndexOf('/');
    var path = filePath.substring(0, index);
    var filename = filePath.substring(index + 1);
    var filenameRoot = filename.substring(0, filename.lastIndexOf('.'));
    var customTemplateFile = path + "/../custom/views/" + filename;
    var styleFile = path + "/../styles/" + filenameRoot + ".js";

    this.readFile(filePath, (err, data) => {
      this.setState({
        template: data,
        templateLoaded: true
      });

      if (fs.existsSync(customTemplateFile) && this.state.customTemplateLoaded) {
        this.mergeTemplates();
      }
    });

    this.readFile(customTemplateFile, (err, data) => {
      this.setState({
        customTemplate: data,
        customTemplateLoaded: true
      });

      if (fs.existsSync(filePath) && this.state.templateLoaded) {
        this.mergeTemplates();
      }
    });

    styles = require(styleFile);
    this.setState({
      stylesLoaded: true
    });
  }*/

  fetchUrl(url, handler) {
    fetch(url, {
        method: 'GET',
        headers: {'Cache-Control': 'no-cache'}
      }).then((response) => {
        response.text();
        if (response.status != 200) {
          throw new Error("Http Status: " + response.status);
        }
      })
      .then((responseText) => {
        handler();
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }

  loadUrl(url) {
    var index = url.lastIndexOf('/');
    var path = url.substring(0, index);
    var filename = url.substring(index + 1);
    var filenameRoot = filename.substring(0, filename.lastIndexOf('.'));
    var customTemplateUrl = path + "/../custom/views/" + filename;
    var styleUrl = path + "/../styles/" + filenameRoot + ".js";

    if (!this.state.loaded) {
      fetchUrl(url, (templateText) => {
        fetchUrl(customTemplateUrl, (customTemplateText) => {
          this.setState({
            template: templateText,
            customTemplate: customTemplateText,
            loaded: true
          });
        });
      });
    }
  }

  loadComponent() {
    if (this.state.loaded) {
      return;
    }

    var path = this.props.template;

    if (path) {
      path = path.trim();
      if (path.startsWith('file://')) {
        //this.loadFile(path.substring(7));
      }
      else if (path.startsWith('http://') || path.startsWith('https://')) {
        this.loadUrl(path);
      }
    }
  }

  // template translation and UI construction
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
    var template = this.state.mergedTemplate ? this.state.mergedTemplate : this.state.template;
    xml2js.parseString(template, (err, result) => {
        console.log(JSON.stringify(result));
        res = this.assembleView(result);
    });

    if (res.length == 1) {
      return res[0];
    }
    return (<View>{res}</View>);
  }
}

var styles = require('./styles');

module.exports = DynamicComponent;
