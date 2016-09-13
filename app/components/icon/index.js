import React, { Component, PropTypes } from "react";
import { IconTypes } from "../../constants";
import { TEXT, IMAGE, PLOTLY, CODE } from "../../assets/icons";
import styles from "./index.css";

const iconTypeMap = {
  [IconTypes.TEXT]: TEXT,
  [IconTypes.IMAGE]: IMAGE,
  [IconTypes.PLOTLY]: PLOTLY,
  [IconTypes.CODE]: CODE
};

class Icon extends Component {
  static propTypes = {
    name: PropTypes.oneOf(Object.keys(IconTypes).map(key => IconTypes[key])).isRequired
  };

  render() {
    const { name, ...rest } = this.props;

    return (
      <span
        className={styles.icon}
        {...rest}
        dangerouslySetInnerHTML={{ __html: iconTypeMap[name] }}
      />
    );
  }
}

export default Icon;
