import React, { Component } from "react";
import { observer } from "mobx-react";
import { without } from "lodash";

import { ColorPicker, FileUpload, Select, Option } from "../editor-components/index.js";
import styles from "../index.css";

@observer
export default class SlideMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  handleColorChange = (hex, opacity) => {
    const style = this.context.store.currentSlide.props.style;
    const updatedColor = {};

    if (style.backgroundColor !== hex) {
      updatedColor.backgroundColor = hex;
    }

    if (style.opacity !== opacity) {
      updatedColor.opacity = opacity;
    }

    if (updatedColor.opacity === undefined && updatedColor.backgroundColor === undefined) {
      return;
    }

    const updatedStyles = {
      ...style,
      ...updatedColor
    };

    this.context.store.updateSlideProps({ style: updatedStyles });
  }

  handleTransitionChange = (ev) => {
    const { value, checked } = ev.target;
    const currentTransitionArray = this.context.store.currentSlide.props.transition;
    let newTransitionArray;

    if (checked) {
      newTransitionArray = currentTransitionArray.concat([value]);
    } else {
      newTransitionArray = without(currentTransitionArray, value);
    }

    this.context.store.updateSlideProps({ transition: newTransitionArray });
  }

  handleBackgroundSizeChange = (value) => {
    this.context.store.updateSlideProps({
      style: {
        backgroundSize: value
      }
    });
  }

  handleImageChange = (img) => {
    this.context.store.updateSlideProps({
      backgroundImageName: img.imageName,
      backgroundImageSrc: img.src,
      style: {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundImage: `url(${img.src})`,
        backgroundSize: this.context.store.currentSlide.props.style.backgroundSize || "cover"
      }
    });
  }

  handleImageClear = () => {
    this.context.store.updateSlideProps({
      backgroundImageName: null,
      backgroundImageSrc: null,
      style: {
        backgroundImage: "none"
      }
    });
  }

  render() {
    const {
      currentSlide: {
        props: {
          style, transition, backgroundImageSrc, backgroundImageName
        }
      }
    } = this.context.store;

    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>Slide</h3>
        <hr className={styles.hr} />
        <div className={styles.row}>
          <div className={`${styles.flexrow} ${styles.flexspacebetween}`}>
            <div>
              <div className={styles.subHeading}>
                Background color
              </div>
              <ColorPicker currentStyles={style} onChangeColor={this.handleColorChange} />
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.subHeading}>
            Background image
          </div>
          <FileUpload
            maxSize={3000000}
            onChange={this.handleImageChange}
            onClear={this.handleImageClear}
            imageName={backgroundImageName}
            placeholder="Image URL"
            src={backgroundImageSrc}
          />
        </div>
        {backgroundImageSrc ?
          <div className={styles.row}>
            <div className={styles.subHeading}>
              Background size
            </div>
            <Select
              onChange={this.handleBackgroundSizeChange}
              selectName="BackgroundSize"
              placeholderText={style.backgroundSize}
              defaultValue={style.backgroundSize}
              currentOptionClassName={styles.select}
            >
              <Option value="cover">Cover</Option>
              <Option value="contain">Contain</Option>
              <Option value="auto">Original</Option>
              <Option value="100% 100%">Stretch</Option>
            </Select>
          </div>
          : null}
        <div className={styles.row}>
          <div className={`${styles.flexrow} ${styles.flexspacebetween}`}>
            <div>
              <div className={styles.subHeading}>
                Transition
              </div>
              <label className={styles.checkboxLabel} >
                <input
                  type="checkbox"
                  name="transitions"
                  value="slide"
                  onChange={this.handleTransitionChange}
                  checked={transition.includes("slide")}
                />
                Slide
              </label>
              <label className={styles.checkboxLabel} >
                <input
                  type="checkbox"
                  name="transitions"
                  value="zoom"
                  onChange={this.handleTransitionChange}
                  checked={transition.includes("zoom")}
                />
                Zoom
              </label>
              <label className={styles.checkboxLabel} >
                <input
                  type="checkbox"
                  name="transitions"
                  value="fade"
                  onChange={this.handleTransitionChange}
                  checked={transition.includes("fade")}
                />
                Fade
              </label>
              <label className={styles.checkboxLabel} >
                <input
                  type="checkbox"
                  name="transitions"
                  value="spin"
                  onChange={this.handleTransitionChange}
                  checked={transition.includes("spin")}
                />
                Spin
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
