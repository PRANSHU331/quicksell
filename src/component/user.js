import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './app.css';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizTwoToneIcon from '@material-ui/icons/MoreHorizTwoTone';
import PriorityHighTwoToneIcon from '@material-ui/icons/PriorityHighTwoTone';
import SignalCellularAltSharpIcon from '@material-ui/icons/SignalCellularAltSharp';
import SignalCellular3BarIcon from '@material-ui/icons/SignalCellular3Bar';
import SignalCellular1BarIcon from '@material-ui/icons/SignalCellular1Bar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import Brightness1Icon from '@material-ui/icons/Brightness1';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ListIcon from '@material-ui/icons/List';
// import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

Modal.setAppElement('#root'); // Set the root element for accessibility


const priorityLabels = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
};

const statusLabels = [
  { name: 'Backlog', icon: <DonutLargeIcon fontSize='inherit' className="blur-icon" /> },
  { name: 'Todo', icon: <RadioButtonUncheckedIcon fontSize='inherit' className="blur-icon" /> },
  { name: 'In progress', icon: <InvertColorsIcon fontSize='inherit' className="blur-icon-progress" /> },
  { name: 'Done', icon: <CheckCircleIcon fontSize='inherit' className="blur-icon-done" /> },
  { name: 'Canceled', icon: <CancelIcon fontSize='inherit' className="blur-icon" /> },
];

const App = () => {
  const [groupingOption, setGroupingOption] = useState(() => {
    // Initialize with the value from localStorage or a default value
    return localStorage.getItem('groupingOption') || 'status';
  });

  const [sortingOption, setSortingOption] = useState(() => {
    // Initialize with the value from localStorage or a default value
    return localStorage.getItem('sortingOption') || 'priority';
  });

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
    localStorage.setItem('groupingOption', option); // Store in localStorage
    closeOptionsModal(); // Close the modal
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
    localStorage.setItem('sortingOption', option); // Store in localStorage
    // closeOptionsModal(); // Close the modal
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

  useEffect(() => {
    const storedGroupingOption = localStorage.getItem('groupingOption');
    if (storedGroupingOption) {
      setGroupingOption(storedGroupingOption);
    }

    const storedSortingOption = localStorage.getItem('sortingOption');
    if (storedSortingOption) {
      setSortingOption(storedSortingOption);
    }
  }, []); // Run this effect only on initial component mount

  return (
    <div>
      <nav className="navbar">
        <div className="left-section">

          <button onClick={openOptionsModal} className="show-options-button">
            <ListIcon fontSize='inherit' /> Display
          </button>
        </div>
        <div className="right-section">
          
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
            top: '70px',
            left: '100px',
            width: '130px',
          },
        }}
      >
        <div className="options-box">
          <div className='group-option'>
            <label>Grouping</label>
            <div className='padding-option'>
              <select onChange={(e) => handleGroupingChange(e.target.value)}>
                <option value="select">Select</option>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
          <div className='sort-option'>
            <label>Ordering</label>
            <div className='padding-option'>
              <select onChange={(e) => handleSortingChange(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
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

  const filterTicketsByStatus = (status) => {
    return sortedTickets.filter(
      (ticket) =>
        ticket.status.toLowerCase() === status.toLowerCase() // Handle mixed case status values
    );
  };

  const countTicketsByStatus = (status) => {
    return filterTicketsByStatus(status).length;
  };

  const countTicketsByUser = (userId) => {
    return sortedTickets.filter((ticket) => ticket.userId === userId).length;
  };

  return (
    <div className="kanban-board">
      {groupingOption === 'status' && (
        <div className="status-container" width='10px'>
          {statusLabels.map((statusObj) => (
            <div className='mid2' key={statusObj.name}>
              <div className='hadding'>
                {statusObj.icon}
                <div className='statuhadding'>
                  {statusObj.name}
                </div>
                <div className='para'>
                  {countTicketsByStatus(statusObj.name)}
                </div>

                <AddIcon fontSize='inherit' className="blur-icon"/>
                <MoreHorizTwoToneIcon fontSize='inherit' className="blur-icon"/>
              </div>
              {filterTicketsByStatus(statusObj.name).map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} onUserClick={onUserClick}  groupingOption={groupingOption}/>
              ))}
            </div>
          ))}
        </div>
      )}
      {groupingOption === 'user' && (
        <div className="user-container">
          {users.map((user) => (
            <div className="mid2" key={user.id}>
              <div className='hadding'>
                <AccountCircleIcon fontSize='inherit' />
                <div className="user-name">{user.name}</div>
                <div className='para'>
                  {countTicketsByUser(user.id)}
                </div>
                <AddIcon fontSize='inherit' className="blur-icon"/>
                <MoreHorizTwoToneIcon fontSize='inherit' className="blur-icon"/>
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
              <div className='mid2' key={priorityLevel}>
                <div className='hadding'>
                  {priorityLabels[priorityLevel] === 'No priority' ? <MoreHorizTwoToneIcon fontSize='inherit' className="blur-icon"/> : ''}
                  {priorityLabels[priorityLevel] === 'Urgent' ? <PriorityHighTwoToneIcon fontSize='inherit' className="blur-icon"/> : ''}
                  {priorityLabels[priorityLevel] === 'High' ? <SignalCellularAltSharpIcon fontSize='inherit' className="blur-icon"/> : ''}
                  {priorityLabels[priorityLevel] === 'Medium' ? <SignalCellular3BarIcon fontSize='inherit' className="blur-icon"/> : ''}
                  {priorityLabels[priorityLevel] === 'Low' ? <SignalCellular1BarIcon fontSize='inherit' className="blur-icon"/> : ''}
                  <div className='priorityhadding'>
                    {priorityLabels[priorityLevel]}
                  </div>
                  <div className='para'>
                    {sortedTickets.filter((ticket) => ticket.priority === parseInt(priorityLevel)).length}
                  </div>
                  <AddIcon fontSize='inherit' className="blur-icon"/>
                  <MoreHorizTwoToneIcon fontSize='inherit' className="blur-icon"/>
                </div>
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

const Ticket = ({ ticket, onUserClick,groupingOption }) => {
  const statusLabel = statusLabels.find((status) => status.name === ticket.status);

  return (
    <div className="ticket">
      <div className='vertical'>
        <div className="ticket-info">
          <div className="ticket-id">{ticket.id}</div>
          <div className="user">
            <AccountCircleIcon fontSize='inherit' />
            {/* <button onClick={() => onUserClick(ticket.userId)}></button> */}
          </div>
        </div>
        {groupingOption!=="status"&&statusLabel&& (
          <div className='statusanstitleinsideticket'>
            {statusLabel.icon}
            <div className="title">{ticket.title}</div>
          </div>
        )}
         
         {groupingOption==="status"&&statusLabel&& (
          <div className='statusanstitleinsideticket'>
            {/* {statusLabel.icon} */}
            <div className="title">{ticket.title}</div>
          </div>
        )}
         
        <div className='tagsrow'>
        <div className='ticket-last-row'>
          <div className='side-icon'>
            <MoreHorizTwoToneIcon fontSize='inherit' className="blur-icon-side" />
          </div>
          </div>
          <div className="tags"><Brightness1Icon fontSize='inherit' className="blur-icon-feature" />{ticket.tag.join(', ')}</div>
        
        </div>
        
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
