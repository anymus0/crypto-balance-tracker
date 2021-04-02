import styles from  "../styles/Settings.module.scss";
import AccountManager from './../components/AccountManager'

const Settings = () => {
  return (
    <div id="settings">
      <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button>

      <div
        className="modal fade"
        id="settingsModal"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="settingsModalLabel">
                Settings
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className={`modal-body ${styles.modalBodyPadding}`}>
              <AccountManager />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
