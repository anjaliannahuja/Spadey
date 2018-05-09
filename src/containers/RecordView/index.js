import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'components/Button';
import MicrophoneIcon from 'material-ui/svg-icons/av/mic';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SaveIcon from 'material-ui/svg-icons/content/save';
import ReactSimpleTimer from 'react-simple-timer';
import Microphone from 'components/Microphone';

import { styles } from './styles.scss';

/* actions */
import * as audioActionCreators from 'core/actions/actions-audio';

class RecordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      saveRecording: false
    };
  }

  startRecording = () => {
    this.setState({
      recording: true
    });
  };

  deleteRecording = () => {
    this.setState({
      recording: false
    });
  };

  saveRecording = () => {
    this.setState({
      recording: false,
      saveRecording: true
    });
  };

  onStop = recording => {
    const { saveRecording } = this.state;
    const { actions } = this.props;

    if (saveRecording) {
      actions.audio.saveRecording(recording);
    }
  };

  render() {
    let buttons;
    const { recording } = this.state;

    if (recording) {
      buttons = (
        <div className="buttons">
          <Button
            className="secondary save"
            iconOnly={true}
            onTouchTap={this.saveRecording}
            icon={<SaveIcon />}
          />
          <Button
            secondary={true}
            raised={true}
            floating={true}
            disabled={true}
            icon={<MicrophoneIcon />}
          />
          <Button
            className="secondary delete"
            iconOnly={true}
            onTouchTap={this.deleteRecording}
            icon={<DeleteIcon />}
          />
        </div>
      );
    } else {
      buttons = (
        <Button
          className="btn"
          secondary={true}
          raised={true}
          floating={true}
          onTouchTap={this.startRecording}
          icon={<MicrophoneIcon />}
        />
      );
    }

    return (
      <div className={styles}>
        <Microphone record={recording} onStop={this.onStop} />
        <div id="controls">
          <ReactSimpleTimer play={recording} />
          {buttons}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      audio: bindActionCreators(audioActionCreators, dispatch)
    }
  };
}

export default connect(null, mapDispatchToProps)(RecordView);
