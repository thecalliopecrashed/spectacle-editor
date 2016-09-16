import React, { Component } from "react";
import { observer } from "mobx-react";

import { ElementTypes } from "../../../constants";
import elements from "../../../elements";
import commonStyles from "../index.css";

import { FileUpload } from "../editor-components";

const defaultImageSource = elements[ElementTypes.IMAGE].props.src;

@observer
export default class ImageMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  shouldComponentUpdate() {
    const { store: { currentElement } } = this.context;
    return currentElement && currentElement.type === ElementTypes.IMAGE;
  }

  handleImageChange = (img, contextData) => {
    const { props } = this.context.store.currentElement;
    const currentWidth = props.style.width;
    const currentHeight = props.style.height;
    const { width, height } = img;
    const ratioX = currentWidth / width;
    const ratioY = currentHeight / height;
    const ratio = ratioX < ratioY ? ratioX : ratioY;
    const nextWidth = width * ratio;
    const nextHeight = height * ratio;

    this.context.store.updateElementProps({
      ...img,
      style: {
        width: nextWidth,
        height: nextHeight,
        opacity: 1
      }
    }, contextData.currentSlideIndex, contextData.currentElementIndex);
  }

  handleImageClear = () => {
    this.context.store.updateElementProps({
      src: defaultImageSource,
      imageName: null,
      style: {
        opacity: 0.3
      }
    });
  }


  render() {
    const { store: { currentElement, currentSlideIndex, currentElementIndex } } = this.context;

    let srcValue = "";
    let fileName = "";

    if (currentElement) {
      const { src, imageName } = currentElement.props;

      // If not the default source
      if (src !== defaultImageSource) {
        srcValue = src;
        fileName = imageName;
      }
    }

    return (
      <div className={commonStyles.wrapper}>
        <h3 className={commonStyles.heading}>Image</h3>
        <hr className={commonStyles.hr} />
        <div className={commonStyles.subHeading}>
          Image URL
        </div>
        <FileUpload
          key={currentElement ? currentElement.id : "-1"}
          contextData={{ currentSlideIndex, currentElementIndex }}
          maxSize={3000000}
          onChange={this.handleImageChange}
          onClear={this.handleImageClear}
          placeholder="http://"
          imageName={fileName}
          src={srcValue}
        />
      </div>
    );
  }
}
