import React from 'react';
import {
   StyleSheet
   ,Text
   ,View
   ,StatusBar
   ,TextInput
   ,Dimensions
   ,Platform
   ,ScrollView
   ,AsyncStorage
  } from 'react-native';
import { render } from 'react-dom';
import { AppLoading } from "expo"
import uuidv1 from "uuid/v1";
import moment from 'moment'

import AddPlan from "./AddPlan";
import AddResult from "./AddResult";
import CheckPlan from "./CheckPlan";
import Calendar from "./Calendar";



export default class App extends React.Component {
  state = {
    loaded:false,
    toPlans:"",
    toResults:{}
  }

  componentDidMount=()=>{
    this._loadPlan();
  }
  
  _loadPlan=async()=>{
    try{
        const toPlans =await AsyncStorage.getItem("toPlans");
        const parsedToPlan = JSON.parse( toPlans );

        const toResults =await AsyncStorage.getItem("toResults");
        const parsedToResult = JSON.parse( toResults );
        
        this.setState({
          loaded:true , 
          toPlans: parsedToPlan || '' , 
          toResults: parsedToResult || {} 
        });    

    }catch(err){
      console.log( err );
    }
    
  };
  
  _savePlan = (newPlans) =>{
    this.setState({toPlans:newPlans});
    const savePlans = AsyncStorage.setItem("toPlans",JSON.stringify(newPlans));
    
  };

 _addToResults=(newResult)=>{
    const {toPlans} = this.state;
    if(toPlans != ""){
      this.setState(prevState=>{
        const ID = uuidv1();
        const newToPlanObject ={
          [ID]:{
            id:ID,
            result:newResult,
            toPlans:toPlans,
            createedAt:  new Date()
          }
        };
        const newState ={
          ...prevState,
          toResults:{
            ...prevState.toResults,
            ...newToPlanObject
          }
        };
        this._saveResult(newState.toResults);
        return {...newState };
      })
    };
  };
  _getCurTime=()=>{
    const date = moment(new Date).format('YYYY-MM-DD');
    return date;
  }
  _saveResult = (newResult) =>{
    const saveResults = AsyncStorage.setItem("toResults",JSON.stringify(newResult));
    
  }

  render() {
    //AsyncStorage.clear()

    const {toPlans , loaded , toResults} = this.state;
    
    var d = new Date() ;
    var _t = d.getHours();

    var todayCheck=false;
    const today = this._getCurTime()
    
    //9시가 넘고 같은 날짜가 존재 할떄
    if(_t >= 21){
      Object.values(toResults).map(result=>{
        
        if( today.toString()  ==  moment(result.createedAt).format('YYYY-MM-DD').toString()  ){
          todayCheck=true;
        };
      });
    }else{
      todayCheck=true;
    };
    
    if( !loaded ){
      return <AppLoading/>
    }; 
    
    if(toPlans == ""){
      return (
              <AddPlan
                _savePlan={this._savePlan}
              />);
    }else if(  !todayCheck ){
      return(
        <AddResult
          _toPlans={toPlans}
          _addToResults={this._addToResults}
          
        />
      )
    }else{
      return (
          <CheckPlan
          _toPlans={toPlans}
          _toResults={toResults}
          />
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


