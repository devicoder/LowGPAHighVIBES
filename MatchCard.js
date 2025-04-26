import React from 'react';


function UnitList({units}) {
  return (
    <div>
      {units.map((unit, index) => (
          <div key={index}>
            {unit}
            <br />
          </div>
      ))}
    </div>
  );
}

function AvailabilityList({ availability }) {
  const formatTime = (num) => {
    const hours = Math.floor(num / 100);
    const minutes = num % 100;
    const h12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${h12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const availabilityList = daysOfWeek.map((day) => {
    const times = availability[day];
    if (!times || times.length === 0) return null;

    const timePairs = [];
    for (let i = 0; i < times.length; i += 2) {
      const start = formatTime(times[i]);
      const end = formatTime(times[i + 1]);
      timePairs.push(`${start} - ${end}`);
    }

    const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
    return (
      <div key={day}>
        {capitalizedDay}: {timePairs.join(', ')}
        <br />
      </div>
    );
  });

  return (
    <div>
      <strong>Availability:</strong>
      <br />
      {availabilityList}
    </div>
  );
}


function MatchCard({userInfo}) {     
    if (userInfo === undefined || userInfo === null) {
        return <div>Loading...</div>;
      }
      


  const fullName = userInfo.name;
  const degree = userInfo.degree;
  const year = userInfo.year; 
  const units = userInfo.units;
  const bio = userInfo.bio;
  const availability = {
    friday: [630, 745, 1200, 1400],
    tuesday: [1100, 1200, 1400, 1500],
    thursday: [],
    monday: [1400, 1600],
    wednesday: []
  };
  //const availability = userInfo.availability;

  return (
    <div>
      <section className="section">
        
        <div className="block"></div>
        <div className="box">
          <article className="media">
            <div className="media-left">
              <figure className="image is-256x256">
                <img
                  className="is-rounded"
                  src="https://bulma.io/assets/images/placeholders/256x256.png"
                  alt="User avatar"
                />
              </figure>
            </div>
            <div className="media-content">
              <div className="content">
                <p style={{ fontSize: '1.3em' }}>
                  <strong>{fullName}</strong> <small></small>
                  <br />
                  {degree} ({year})
                </p>
                <p>
                  <strong>Units:</strong>
                  <br />
                  <UnitList units={units} />
                  <br />
                  <AvailabilityList availability={availability} />
                </p>
              </div>
            </div>
          </article>
          <p style={{ fontSize: '1.1em' }}>
            <strong>Bio:</strong> {bio}
          </p>
        </div>
      </section>
    </div>
  );
}

export default MatchCard;