/**
 *
 * Test
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import wrapper from '../../utils/componentWrapper';

import style from './style.css';

const using = {
  "time":"state"
}

/* eslint-disable react/prefer-stateless-function */
export class Test extends React.Component {
  render() {
    return (
      <div className="test" onClick={()=>{this.props.time.set("time",Date.now()); }}>
        <Helmet>
          <title>Test</title>
          <meta name="description" content="Description of Test" />
        </Helmet>
        <FormattedMessage {...messages.header} />
        <div>{this.props.time.get()}</div>
      </div>
    );
  }
}

export default wrapper(using)(Test);
