/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import styles from './dashboard.module.scss';
import DashboardHeader from './DashboardHeader';
import RenderRow from './RenderRow';
import cogImage from '../../icons/cog.png';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monitors: props.monitors,
      showHeaderIcon: false,
      visibleheader: [],
    };
    this.state.visibleheader = this.getVisibleHeaders();
  }

  //   componentDidMount() {
  //   }

  getKeys = () => {
    const { monitors } = this.state;
    const { 0: firstMonitor } = monitors;
    return Object.keys(firstMonitor);
  };

  getHeaders = () => {
    const keys = this.getKeys();
    return keys.map((key) => {
      if (this.state.visibleheader[key].isVisible) {
        return (
          <th key={key} className={cx(styles['table-head-row'])}>
            {key}
          </th>
        );
      }
      return null;
    });
  };

  getToggleheaders = () => {
    const keys = this.getKeys();
    return keys.map((key) => {
      return (
        <div key={key} className={cx(styles['toggle-item'])}>
          <label htmlFor={key}>
            {key}
            <input
              id={key}
              type="checkbox"
              checked={this.state.visibleheader[key].isVisible}
              onChange={() => {
                this.specificToggleHeader(key);
              }}
            />
            <span className={cx(styles.checkmark)} />
          </label>
        </div>
      );
    });
  };

  getUniqueValuesInHeaders = () => {
    const uniqueHeaderValues = {};
    const keys = this.getKeys();
    const { monitors } = this.state;
    for (let i = 0; i < keys.length; i += 1) {
      uniqueHeaderValues[keys[i]] = [];
    }
    monitors.map((monitor) => {
      Object.keys(monitor).forEach((data) => {
        if (!uniqueHeaderValues[data].includes(monitor[data])) {
          uniqueHeaderValues[data].push(monitor[data]);
        }
      });
      return monitor;
    });
    return uniqueHeaderValues;
  };

  getVisibleHeaders = () => {
    const visibleheader = [];
    const keys = this.getKeys();
    keys.map((key) => {
      visibleheader[key] = { isVisible: true };
      return key;
    });
    return visibleheader;
  };

  getRowData = () => {
    const { monitors } = this.state;
    const keys = this.getKeys();
    return monitors.map((row, index) => {
      return (
        <tr key={index} className={cx(styles['table-row'])}>
          <RenderRow
            key={index}
            data={row}
            headerVisible={this.state.visibleheader}
            keys={keys}
          />
        </tr>
      );
    });
  };

  toggleShowHeader = () => {
    this.setState((prevState) => {
      return { showHeaderIcon: !prevState.showHeaderIcon };
    });
  };

  specificToggleHeader(key) {
    const newVisibleHeader = this.state.visibleheader;
    newVisibleHeader[key].isVisible = !newVisibleHeader[key].isVisible;
    this.setState(() => {
      return { visibleheader: newVisibleHeader };
    });
  }

  render() {
    return (
      <div className={cx(styles.dashboardContainer)}>
        <DashboardHeader />
        <div className={cx(styles['icon-container'])}>
          <img
            onClick={this.toggleShowHeader}
            src={cogImage}
            alt="cog"
            className={cx(styles['cog-icon'])}
          />
          {this.state.showHeaderIcon ? (
            <div className={cx(styles['toggle-header-content'])}>
              <h3 className={cx(styles['toggle-header-heading'])}>
                {this.props.toggleHeader}
              </h3>
              {this.getToggleheaders()}
            </div>
          ) : null}
        </div>
        <table>
          <thead className={cx(styles['table-head'])}>
            <tr>{this.getHeaders()}</tr>
          </thead>
          <tbody>{this.getRowData()}</tbody>
        </table>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { ...state };
};
export default connect(mapStateToProps)(Dashboard);