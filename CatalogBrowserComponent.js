/**
 * Sample React Native
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';

var AppPlatform = require('./lib/model/storeplatform');
var DynamicComponent = require('./DynamicComponent');
var DWButton = require('./DWButton');

var browser;

class CatalogBrowserComponent extends Component {

  // initialization
  constructor(props) {
    super(props);
    browser = this;

    this.state = {
      queryString: 'red',
      results: undefined,
      cursor: 0,
      count: 0,
      product: undefined
    };
  }

  componentDidMount() {
    this.search();
  }

  loadProduct(id) {
    AppPlatform.Product.find(id, {
      onload: function(e) {
        browser.setState({product: e});
      },
      onerror: function(e) {
        console.log(e);
      }
    });
  }

  search() {
    AppPlatform.ProductSearch.search(this.state.queryString, {
      onload: function(e) {
        browser.setState({results: e, cursor: 0});
        browser.loadProduct(browser.state.results.hits[browser.state.cursor].product_id);
      },
      onerror: function(e) {
        console.log(e);
      }
    });
  }

  nextButtonClicked() {
    if (browser.state.cursor < browser.state.results.count) {
      browser.state.cursor++;
      browser.loadProduct(browser.state.results.hits[browser.state.cursor].product_id);
    }
  }

  prevButtonClicked() {
    if (browser.state.cursor > 0) {
      browser.state.cursor--;
      browser.loadProduct(browser.state.results.hits[browser.state.cursor].product_id);
    }
  }

  buttonClicked() {
  }

  render() {
    if (!this.state.product) {
      return (<View/>);
    }

    return (
      <View style={styles.container}>
        <TextInput style={styles.input} onChangeText={(text) => this.state.queryString = text} value={this.state.queryString}/>
        <Image style={styles.image} source={{uri: (this.state.product ? this.state.product.image_groups[0].images[0].link : '')}}/>
        <View style={styles.buttonContainer}>
          <DWButton buttonStyle={styles.prevButton} buttonTextStyle={styles.buttonText} handler={this.prevButtonClicked}>Prev</DWButton>
          <DWButton buttonStyle={styles.nextButton} buttonTextStyle={styles.buttonText} handler={this.nextButtonClicked}>Next</DWButton>
          <DWButton buttonStyle={styles.nextButton} buttonTextStyle={styles.buttonText} handler={this.buttonClicked}>New</DWButton>
        </View>
        <DynamicComponent product={this.state.product} template='http://localhost/views/productInfo.xml'/>
      </View>
    );
  }
}

var styles = require('./styles');

module.exports = CatalogBrowserComponent;
