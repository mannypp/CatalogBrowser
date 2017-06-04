'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';

class ProductInfo extends Component {
  // initialization
  constructor(props) {
    super(props);
    this.state = {
        product: {
          name: "NAME",
          description: "DESC",
          currency: "usd",
          price: 50.0
        }
      }
    };
  }

  render() {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.text}>{this.state.product.name}</Text>
        <Text style={styles.descriptionText}>{this.state.product.description}</Text>
        <Text style={styles.text}>{AppPlatform.Utils.getCurrencySymbol(this.state.product.currency) + this.state.product.price}</Text>
      </View>
    );
  }
}

var styles = React.StyleSheet.create({
  textContainer: {
    width: 370,
    paddingTop: 10,
  },
  text: {
    width: 345,
    paddingLeft: 10,
    paddingTop: 10,
  },
  descriptionText: {
    width: 345,
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingTop: 10,
  }
});

AppRegistry.registerComponent('ProductInfo', () => ProductInfo);
