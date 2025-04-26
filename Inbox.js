import React from 'react'
import MatchCard from './MatchCard.js'
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';
import { getCurrentUserUID } from './App.js'

const myUnits = ["FIT1058", "FIT1047", "ASP1010", "FIT1045"];
const myAvailability = {
  friday: [630, 745, 1200, 1400],
  tuesday: [1100, 1200, 1400, 1500],
  thursday: [],
  monday: [1400, 1600],
  wednesday: []
};

function hasOverlap(baseAvailability, compareAvailability) {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const toIntervals = (times) => {
    const intervals = [];
    for (let i = 0; i < times.length; i += 2) {
      intervals.push([times[i], times[i + 1]]);
    }
    return intervals;
  };

  for (const day of daysOfWeek) {
    const baseTimes = toIntervals(baseAvailability[day] || []);
    const compareTimes = toIntervals(compareAvailability[day] || []);

    for (const [start1, end1] of baseTimes) {
      for (const [start2, end2] of compareTimes) {
        // Check for overlap
        if (start1 < end2 && start2 < end1) {
          return true;
        }
      }
    }
  }

  return false;
}


function Inbox() {
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('timestamp', 'desc'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsersList(users);
          
        });
        return () => unsubscribe(); // cleanup listener
        
      }, [usersList]);
  /*
  for (user of usersList) {
       if (user["uid"] == uid) {
          const ourUser = user;
          ourUserIndex = usersList.indexOf(ourUser);
          usersList.splice(ourUserIndex,1);
          break;
      }
  }
  

  const myUnits = ourUser["units"]
  const myAvailability = ourUser["availability"]
  */
  const userCount = usersList.length;
  var compatibleUsers = [];

  for (let i = 0; i < userCount; i++) {
    const currUser = usersList[i];
    const userUnits = currUser.units;
    const unitCount = userUnits.length;

    for (let j = 0; j < unitCount; j++) {
      if (myUnits.includes(userUnits[j])) {
        compatibleUsers.push(currUser)
        break
      }
    }
  }

  var timeCompatibleUsers = [];

  for (let i = 0; i < compatibleUsers.length; i ++) {

    if (hasOverlap(myAvailability, compatibleUsers[i]["availability"])) {
      timeCompatibleUsers.push(compatibleUsers[i])
    }
    
  }

  return (
    <div className="inbox">
      <h1>Inbox</h1>
        <p>Welcome to your inbox! Here you can find students to connect with!!</p>
        {timeCompatibleUsers.map((user, index) => (
          <div key={index}>
            <MatchCard userInfo={user}/>
            <br />
          </div>
      ))}
        
    </div>
  )
}





export default Inbox
