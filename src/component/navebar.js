import React, { useState } from 'react';
import Modal from 'react-modal';
import './app.css';
const initialData = [
  // Your initial ticket data goes here
];

Modal.setAppElement('#root'); // Set the root element for accessibility

const App = () => {
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortingOption, setSortingOption] = useState('priority');
  const [tickets, setTickets] = useState(initialData);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
  };

  const openOptionsModal = () => {
    setIsOptionsModalOpen(true);
  };

  const closeOptionsModal = () => {
    setIsOptionsModalOpen(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="left-section">
          <button onClick={openOptionsModal} className="show-options-button">
            <img src="./dropdown.png" alt="Icon"
              style={{ width: '20px', height: '10px' }}
            />
            Show Options
          </button>
        </div>
        <div className="right-section">
          {/* Add other navbar elements on the right side here */}
        </div>
      </nav>
      <Modal
        isOpen={isOptionsModalOpen}
        onRequestClose={closeOptionsModal}
        contentLabel="Grouping and Sorting Options"
        className="modal"
        overlayClassName="overlay"
        style={{
            content: {
              top: '120px', // Adjust the top position as needed
              left: '200px', // Adjust the left position as needed
              width:'200px'
            },
          }}
      >
        <div className="options-box mx-2">
          <div>
            <label>Group By:</label>
            <select onChange={(e) => handleGroupingChange(e.target.value)}>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div>
            <label>Sort By:</label>
            <select onChange={(e) => handleSortingChange(e.target.value)}>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
          <button onClick={closeOptionsModal}>Close</button>
        </div>
      </Modal>
      <KanbanBoard
        tickets={tickets}
        groupingOption={groupingOption}
        sortingOption={sortingOption}
      />
    </div>
  );
};

const KanbanBoard = ({ tickets, groupingOption, sortingOption }) => {
  // Implement the logic to group and sort the tickets based on user choices
  // You can use Array methods like filter, sort, and reduce to achieve this
  // Create separate columns/sections for each group (e.g., Status, User, Priority)
  // Render the Ticket components in the appropriate columns

  return (
    <div>
      {/* Render the Kanban board based on the grouped and sorted data */}
      {/* Example: columns for each group */}
      {/* You will need to iterate through the grouped and sorted tickets here */}
    </div>
  );
};

const Ticket = ({ ticket }) => {
  return (
    <div className="ticket">
      <div className="title">{ticket.title}</div>
      <div className="priority">{ticket.priority}</div>
      <div className="status">{ticket.status}</div>
      <div className="user">{ticket.user}</div>
      {/* Add more ticket details as needed */}
    </div>
  );
};

export default App;
