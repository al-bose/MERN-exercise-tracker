import React, { Component, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useParams, useLocation } from 'react-router';
import { useState } from 'react';


export default function EditExercise()
{

  let newExercise = {
    username: '',
    description: '',
    duration: 0,
    date: new Date()
  }
    
    const id = useParams().id;
    const [loadingExercise, setLoadingExercise] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [exercise, setExercise] = useState(newExercise);
    const [users, setUsers] = useState([]);
   

    useEffect(() => 
    {
      axios.get('http://localhost:5004/exercises/'+ id)
      .then(response => {
        response.data.date = new Date(response.data.date)
        setExercise(response.data)
        setLoadingExercise(false)
      })
      .catch(function (error) {
        console.log(error);
      })
      axios.get('http://localhost:5004/users/')
      .then(response => {
          setUsers(response.data.map(user => user.username))
          setLoadingUsers(false)
      })
      .catch((error) => {
        console.log(error);
      })

    }, [])
    
    function onSubmit(e) {
        e.preventDefault();
    
        axios.post('http://localhost:5004/exercises/update/'+id, exercise)
          .then(res => console.log(res.data));
        
        window.location = '/';
      }


    return (
      (loadingExercise || loadingUsers) ? 
       (<div>Loading...</div>) : 
       
        (<div>
          <h3>Edit Exercise Log</h3>
          <form onSubmit={(e)  => onSubmit(e)}>
            <div className="form-group"> 
              <label>Username: </label>
              <select
                  className="form-control"
                  value={exercise.username}
                  onChange={(e) => {exercise.username = e.target.value; setExercise({...exercise});}}>
                  {
                    users.map(function(user) {
                      return <option 
                        key={user}
                        value={user}>{user}
                        </option>;
                    })
                  }
              </select>
            </div>
            <div className="form-group"> 
              <label>Description: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={exercise.description}
                  onChange={(e) => {exercise.description = e.target.value; setExercise({...exercise});}}
                  />
            </div>
            <div className="form-group">
              <label>Duration (in minutes): </label>
              <input 
                  type="text" 
                  className="form-control"
                  value={exercise.duration}
                  onChange={(e) => {exercise.duration = e.target.value; setExercise({...exercise});}}
                  />
            </div>
            <div className="form-group">
              <label>Date: </label>
              <DatePicker
              selected = {exercise.date}
                onChange={
                  (e) => {exercise.date = e; setExercise({...exercise});}
                }
              />
            </div>
  
            <div className="form-group">
              <input type="submit" value="Edit Exercise Log" className="btn btn-primary" />
            </div>
          </form>
        </div>)

    )}
                




