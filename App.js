
import './App.css';
import { db}from './firebase.js';
import { addDoc, collection, serverTimestamp} from 'firebase/firestore';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Inbox from './Inbox.js';
import Login from './Login.js';
import { getAuth } from "firebase/auth";

function App() {
  
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const saveAnswer = async (e) => {
    e.preventDefault(); // move this to the top
    const name = e.target.name.value.trim();
    const units = e.target.units.value.trim();
    const bio = e.target.bio.value.trim();
    const degree = e.target.degree.value.trim();
    const monday = e.target.monday.value.trim();
    const tuesday = e.target.tuesday.value.trim();
    const wednesday = e.target.wednesday.value.trim();
    const thursday = e.target.thursday.value.trim();
    const friday = e.target.friday.value.trim();
    const uid = user.uid;
   /* const profilePicture = e.target.profilePicture.files[0]; */

 
    // Check for empty fields
    if (name === "" || units === "" || bio === "" || degree === "") {
      alert("Please fill in all fields");
      return;
    }

    console.log(uid)
  
    // Validate units format
    const unitPattern = /^[A-Za-z]{3}\d{4}$/;
    const unitArray = units.split(',').map(u => u.trim());
  
    const allValid = unitArray.every(unit => unitPattern.test(unit));
    if (!allValid) {
      alert("Units must be comma-separated values in the format: 3 letters followed by 4 numbers (e.g., MAT1010, ENG2021)");
      return;
    }

     // Validate and parse availability
     const timeRangePattern = /^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/;
  
     const parseTimeToMinutes = (timeStr) => {
       const [hours, minutes] = timeStr.split(':').map(Number);
       return hours * 60 + minutes;
     };
   
     const parseDayTimes = (dayString) => {
       if (dayString === "") return [];
       const ranges = dayString.split(',').map(r => r.trim());
       const times = [];
   
       for (const range of ranges) {
         if (!timeRangePattern.test(range)) {
           throw new Error("Invalid time range format: " + range);
         }
         const [start, end] = range.split('-').map(t => t.trim());
   
         const startMinutes = parseTimeToMinutes(start);
         const endMinutes = parseTimeToMinutes(end);
   
         if (startMinutes >= endMinutes) {
           throw new Error("Start time must be before end time in range: " + range);
         }
   
         // Convert HH:MM to integer like 900, 1530
         const startInt = parseInt(start.replace(':', ''), 10);
         const endInt = parseInt(end.replace(':', ''), 10);
   
         times.push(startInt);
         times.push(endInt);
       }
   
       return times;
     };
   
     let availability = {};
     try {
       availability = {
         monday: parseDayTimes(monday),
         tuesday: parseDayTimes(tuesday),
         wednesday: parseDayTimes(wednesday),
         thursday: parseDayTimes(thursday),
         friday: parseDayTimes(friday),
       };
     } catch (error) {
       alert(error.message);
       return;
     }
  
    try {
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        name,
        units: unitArray, // You can store it as an array
        bio,
        degree,
        timestamp: serverTimestamp(),
        availability,
        uid: uid,
        //profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : null,
        //uid: uid,

      });
      e.target.reset();
      e.target.name.focus();
      navigate('/inbox');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };  

  
  
  return (
    <div className="App">
     
      <Routes>
        <Route path="/" element={<div><h1>Tell us about you!</h1>
      <form onSubmit={saveAnswer}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <br /> 
        <label>
          Degree:
          <input type="text" name="degree" />
        </label>
        <br />
        <label>
          Units:
          <input name="units" />
        </label>
        <br />
        <label>
          Bio:
          <textarea name="bio" rows="5" />
        </label>
        <h3>Available Times (e.g., 09:00 - 13:30, 17:00 - 18:00)</h3>
              <label>
                Monday:
                <input type="text" name="monday" placeholder="09:00 - 13:30, 17:00 - 18:00" />
              </label>
              <br />
              <label>
                Tuesday:
                <input type="text" name="tuesday" placeholder="09:00 - 13:30, 17:00 - 18:00" />
              </label>
              <br />
              <label>
                Wednesday:
                <input type="text" name="wednesday" placeholder="09:00 - 13:30, 17:00 - 18:00" />
              </label>
              <br />
              <label>
                Thursday:
                <input type="text" name="thursday" placeholder="09:00 - 13:30, 17:00 - 18:00" />
              </label>
              <br />
              <label>
                Friday:
                <input type="text" name="friday" placeholder="09:00 - 13:30, 17:00 - 18:00" />
              </label>
              <br />
        {/*<label>
          Profile Picture Upload:
          <input type="file" name="profilePicture" accept="image/*" />
        </label>
        */}
        {/*<label>
          Availability:
          <input name="bio" />
        </label> 
        <br /> */}
        <button type="submit">Submit</button>
      </form></div>} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export const getCurrentUserUID = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export default App;
