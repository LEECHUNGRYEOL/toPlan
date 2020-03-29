import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import PropTypes from "prop-types";
import moment from "moment"; 

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  static propTypes = {
    _toResults: PropTypes.object.isRequired
  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

 
 
  render() {
    const {_toResults} = this.props;
    
    let today = moment();
    let customDatesStyles = [];
    
    Object.values(_toResults).map(result=>{
            
      customDatesStyles.push({
        date: result.createedAt,
        // Random colors
        style: {backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)},
        textStyle: {color: 'black'}, // sets the font color
        containerStyle: [], // extra styling for day container
      });
    });
      
    return (
      <CalendarPicker
        todayTextStyle={{fontWeight: 'bold'}}
        todayBackgroundColor={'transparent'}
        customDatesStyles={customDatesStyles}
        minDate={today}
      />
    );
}

}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
  perpect:{
    color:'blue'
  }
});