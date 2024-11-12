import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { toast } from 'react-toastify';
import api from '../../config/axiox';
import './index.css';

function RideSchedule() {
  const [rides, setRides] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get('/rides/getAll');
        setRides(response.data);
      } catch (error) {
        toast.error('Failed to fetch rides');
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, []);

  const events = rides.map((ride) => {
    const startDateTime = `${ride.rideDate}T${ride.startTime.slice(11)}`;
    const endDateTime = `${ride.rideDate}T${ride.endTime.slice(11)}`;

    return {
      id: ride.rideId,
      title: `Ride ${ride.rideCode}: ${ride.startLocationName || ''} - ${ride.endLocationName || ''}`,
      start: startDateTime,
      end: endDateTime,
      extendedProps: {
        capacity: ride.capacity,
        availableSeats: ride.availableSeats,
        price: ride.price,
        status: ride.status,
        organizer: ride.organizerUsername,
        participants: ride.participantUsernames.join(', '),
      },
    };
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleEventClick = (info) => {
    setModalData(info.event.extendedProps);
    toggleModal();
  };

  return (
    <div className="ride-schedule">
      <h2 className="schedule-title">Ride Schedule</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventContent={(eventInfo) => (
          <div className="calendar-event-content">
            <b>{eventInfo.timeText}</b>
            <span>{eventInfo.event.title}</span>
          </div>
        )}
        eventClick={handleEventClick}
      />

      {/* Modal for Event Details */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Ride Details</ModalHeader>
        {modalData && (
          <ModalBody>
            <p><strong>Organizer:</strong> {modalData.organizer}</p>
            <p><strong>Status:</strong> {modalData.status}</p>
            <p><strong>Capacity:</strong> {modalData.capacity}</p>
            <p><strong>Available Seats:</strong> {modalData.availableSeats}</p>
            <p><strong>Price:</strong> ${modalData.price}</p>
            <p><strong>Participants:</strong> {modalData.participants || 'None'}</p>
          </ModalBody>
        )}
        </Modal>
    </div>
  );
}

export default RideSchedule;