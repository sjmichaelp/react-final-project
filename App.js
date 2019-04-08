import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FinalProject from './components/FinalProject';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FinalProject />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: 'rgb(64,64,64)',
    alignItems: 'center',

  },
});
