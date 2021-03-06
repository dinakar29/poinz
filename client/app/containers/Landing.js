import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import RoomJoinForm from '../components/RoomJoinForm';
import RoomHistory from '../components/RoomHistory';
import GithubRibbon from '../components/GithubRibbon';

/**
 * The "landing" page where the user can enter a room name to join
 */
const Landing = ({t, roomHistoryLength, waitingForJoin})=> {
  return (
    <div className="landing">
      <GithubRibbon />
      <div className="landing-inner">
        {!waitingForJoin && <RoomJoinForm />}
        {!waitingForJoin && roomHistoryLength && <RoomHistory />}
        {waitingForJoin && <Loader t={t}/>}
      </div>
    </div>
  );
};

Landing.propTypes = {
  t: PropTypes.func,
  waitingForJoin: PropTypes.bool,
  roomHistoryLength: PropTypes.number
};

export default connect(
  state => ({
    t: state.translator,
    roomHistoryLength: state.roomHistory.length,
    waitingForJoin: !!Object.values(state.pendingCommands).find(cmd => cmd.name === 'joinRoom')
  })
)(Landing);

const Loader = ({t}) => (
  <div className="eyecatcher loading">
    {t('loading')}
  </div>
);

Loader.propTypes = {
  t: PropTypes.func
};
