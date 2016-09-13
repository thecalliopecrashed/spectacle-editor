import React, { Component } from "react";

import styles from "../index.css";
import { map } from "lodash";

import {
  Incrementer,
  Option,
  Select
} from "../editor-components/index.js";
import { ElementTypes, CodeLanguages, CodeThemes } from "../../../constants";

export default class CodeMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { };
  }

  shouldComponentUpdate() {
    const { store: { currentElement } } = this.context;
    return currentElement && currentElement.type === ElementTypes.CODE;
  }

  handleLanguageChange = (value) => {
    this.context.store.updateElementProps({
      language: value
    });
  }

  handleThemeChange = (value) => {
    this.context.store.updateElementProps({
      theme: value
    });
  }

  render() {
    const currentElement = this.context.store.currentElement;

    return (
      <div className={styles.wrapper}>
        {
          currentElement &&
          (
          <div>
            <h3 className={styles.heading}>Code</h3>
            <hr className={styles.hr} />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Language
              </div>
              <div>
                <Select
                  onChange={this.handleLanguageChange}
                  selectName="Language"
                  placeholderText={currentElement.props.language}
                  defaultValue={currentElement.props.language}
                  currentOptionClassName={styles.select}
                >
                  {map(CodeLanguages, (val, key) => (
                    <Option
                      key={key}
                      value={key}
                    >
                      {val}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.subHeading}>
                Theme
              </div>
              <div>
                <Select
                  onChange={this.handleThemeChange}
                  selectName="Theme"
                  placeholderText={currentElement.props.theme}
                  defaultValue={currentElement.props.theme}
                  currentOptionClassName={styles.select}
                >
                  {map(CodeThemes, (val, key) => (
                    <Option
                      key={key}
                      value={key}
                    >
                      {val}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Font size
              </div>
              <div>
                <Incrementer
                  currentElement={currentElement}
                  propertyName={"fontSize"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
