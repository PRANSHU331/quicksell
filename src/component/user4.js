import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './app.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

const priorityLabels = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
};

const App = () => {
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortingOption, setSortingOption] = useState('priority');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [data, setData] = useState({ tickets: [], users: [] });
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data from your API here and update the state using setData
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((apiData) => setData(apiData))
      .catch((error) => console.error('Error fetching data: ', error));
  }, []); // The empty dependency array ensures this effect runs once after the initial render

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

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="left-section">
          <button onClick={openOptionsModal} className="show-options-button">
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
            top: '120px',
            left: '200px',
            width: '200px',
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
          <button onClick={closeOptionsModal} className="show-options-button">
            Close
          </button>
        </div>
      </Modal>
      <KanbanBoard
        data={data}
        groupingOption={groupingOption}
        sortingOption={sortingOption}
        selectedUserId={selectedUserId}
        onUserClick={handleUserClick}
      />
    </div>
  );
};

const KanbanBoard = ({ data, groupingOption, sortingOption, selectedUserId, onUserClick }) => {
  const { tickets, users } = data;

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortingOption === 'priority') {
      return b.priority - a.priority;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="kanban-board">
      {groupingOption === 'status' && (
        <div className="status-container">
          {['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'].map((status) => (
            <div key={status}>
              <h3>{status}</h3>
              {sortedTickets
                .filter((ticket) => ticket.status === status)
                .map((ticket) => (
                  <Ticket key={ticket.id} ticket={ticket} onUserClick={onUserClick} />
                ))}
            </div>
          ))}
        </div>
      )}
      {groupingOption === 'user' && (
        <div className="user-container">
          {users.map((user) => (
            <div className="user-details" key={user.id}>
              <div className="user-name">{user.name}</div>
              <div className="user-availability">
                {user.available ? 'Available' : 'Not Available'}
              </div>
              {sortedTickets
                .filter((ticket) => ticket.userId === user.id)
                .map((ticket) => (
                  <Ticket key={ticket.id} ticket={ticket} onUserClick={onUserClick} />
                ))}
            </div>
          ))}
        </div>
      )}
      {groupingOption === 'priority' && (
        <div className="priority-container">
          {Object.keys(priorityLabels)
            .sort((a, b) => b - a)
            .map((priorityLevel) => (
              <div key={priorityLevel}>
                <h3>{priorityLabels[priorityLevel]}</h3>
                {sortedTickets
                  .filter((ticket) => ticket.priority === parseInt(priorityLevel))
                  .map((ticket) => (
                    <Ticket key={ticket.id} ticket={ticket} onUserClick={onUserClick} />
                  ))}
              </div>
            ))}
        </div>
      )}
      {selectedUserId && <UserDetails userId={selectedUserId} users={users} />}
    </div>
  );
};

const Ticket = ({ ticket, onUserClick }) => {
  return (
    <div className="ticket">
      <div className="ticket-info">
        <div className="title">{ticket.title}</div>
        <div className="priority">{priorityLabels[ticket.priority]}</div>
        <div className="status">{ticket.status}</div>
      </div>
      <div className="user">
        <div>{ticket.userId}</div>
        <button onClick={() => onUserClick(ticket.userId)}>View User Details</button>
      </div>
    </div>
  );
};

const UserDetails = ({ userId, users }) => {
  const user = users.find((u) => u.id === userId);

  return (
    <div className="user-details">
      <div className="user-name">{user.name}</div>
      <div className="user-availability">
        {user.available ? 'Available' : 'Not Available'}
      </div>
    </div>
  );
};

export default App;
