import React, { useEffect, useState } from 'react';
import "./ShowtimeSelector.css";

const ShowtimeSelector = ({ className, theaterShowtimes, onBookTicket }) => {
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [uniqueTheaters, setUniqueTheaters] = useState([]);

  useEffect(() => {
    if (theaterShowtimes.length > 0) {
      setShouldAnimate(true);
      
      const theaters = [];
      const theaterIds = new Set();
      for (const showtime of theaterShowtimes) {
        if (!theaterIds.has(showtime.theater_id)) {
          theaterIds.add(showtime.theater_id);
          theaters.push({
            theater_id: showtime.theater_id,
            name: showtime.name,
            region: showtime.region,
          });
        }
      }
      setUniqueTheaters(theaters);
    }
  }, [theaterShowtimes]);

  const handleTheaterSelect = (theaterId) => {
    setSelectedTheaterId(theaterId);
  };

  const getFutureShowtimes = () => {
    const currentTime = new Date();
    return theaterShowtimes.filter(showtime => 
      new Date(showtime.showtime) > currentTime && showtime.theater_id === selectedTheaterId
    );
  };

  return (
    <div className={`showtime-selector ${shouldAnimate ? 'fade-in' : ''}`}>
      {selectedTheaterId == null && (
        <>
          <h3>Select a Theater:</h3>
          {uniqueTheaters.map((theater) => (
            <button key={theater.theater_id} onClick={() => handleTheaterSelect(theater.theater_id)}>
              {theater.name}
            </button>
          ))}
        </>
      )}

      {selectedTheaterId != null && (
        <>
          <h3>Select a Showtime:</h3>
          {getFutureShowtimes().length > 0 ? (
            getFutureShowtimes().map((showtime) => (
              <div key={showtime.schedule_id} className="showtime-entry">
                <span className="theater-icon">🎭</span> {/* Example using emoji */}
                <div className="showtime-details">
                  <p>{showtime.name} - {new Date(showtime.showtime).toLocaleString()}</p>
                  <button onClick={() => onBookTicket(showtime)}>Book Ticket</button>
                </div>
              </div>
            ))
          ) : (
            <p>There are no future showtimes in this theater.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ShowtimeSelector;
