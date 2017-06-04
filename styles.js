'use strict';

var React = require('react-native');

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  input: {
    height: 18,
    width: 345,
    left: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10
  },

  image: {
    height: 345,
    width: 345,
    borderColor: 'gray',
    borderWidth: 1
  },

  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
  },
  prevButton: {
  },
  nextButton: {
    paddingLeft: 30
  },
  buttonText: {
  }
});

module.exports = styles;
