import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { omit, pick } from "lodash";
import Syntax from "spectacle-editor-viewer/lib/components/syntax";
import { observer } from "mobx-react";
import CanvasElement, { CanvasElementPropTypes } from "../../canvas-element";
import styles from "./index.css";

@observer
export default class TextElement extends Component {
  static propTypes = {
    ...CanvasElementPropTypes,
    rect: PropTypes.object,
    component: PropTypes.shape({
      props: PropTypes.object,
      defaultText: PropTypes.string
    })
  }

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditing: false,
      value: this.props.component.props.source || this.props.component.defaultText
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isEditing) {
      if (!nextProps.isSelected) {
        this.stopEditing();
        this.captureUp = false;
      }
    }
  }

  getSize = () => ({
    width: this.props.component.props.style.width,
    height: this.props.component.props.style.height,
    left: this.props.component.props.style.left,
    top: this.props.component.props.style.top
  })

  stopEditing = () => {
    this.context.store.updateElementProps({
      source: this.state.value
    }, this.currentSlideIndex, this.currentElementIndex);
    this.setState({ isEditing: false, value: null });
  }

  startEditing = () => {
    // Keep track of current slide and element in case we're deselected before we persist changes
    this.currentSlideIndex = this.context.store.currentSlideIndex;
    this.currentElementIndex = this.context.store.currentElementIndex;

    this.setState({
      isEditing: true,
      value: this.props.component.props.source || this.props.component.defaultText
    }, () => {
      this.inputElement.focus();
      this.inputElement.setSelectionRange(0, 0);
      this.inputElement.scrollTop = 0;
    });
  }

  handleMouseDown = (e) => {
    if (this.props.isSelected && !this.state.isEditing) {
      this.captureUp = true;
    }
    if (this.state.isEditing) {
      e.stopPropagation();
    }
  }

  handleMouseUp = (e) => {
    if (this.captureUp && this.props.isSelected &&
        !this.props.isDragging && !this.state.isEditing) {
      this.startEditing(e);
    }
    this.captureUp = false;
  }

  handleBlur = () => {
    this.stopEditing();
  }

  handleChange = () => {
    this.setState({ value: this.inputElement.value });
  }

  handleKeyDown = (e) => {
    const superKey = process.platform === "darwin" ? e.metaKey : e.ctrlKey;
    // undo super+z, stop propagation so as not to trigger global undo
    if (superKey && e.which === 90 && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      document.execCommand("undo");
    }

    // undo super+shift+z, stop propagation so as not to trigger global redo
    if (superKey && e.which === 90 && e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      document.execCommand("redo");
    }

    // escape will finalze edit, trigger blur
    if (e.which === 27) {
      e.preventDefault();
      this.stopEditing();
    }

    // handle tab key
    if (e.which === 9) {
      const start = this.inputElement.selectionStart;
      const end = this.inputElement.selectionEnd;
      const value = this.inputElement.value;
      // set textarea value to: text before caret + tab + text after caret
      this.inputElement.value = `${value.substring(0, start)}\t${value.substring(end)}`;
      this.inputElement.selectionStart = this.inputElement.selectionEnd = start + 1;
      // prevent the focus lose
      e.preventDefault();
    }
  }

  render() {
    const componentProps = this.props.component.props;

    const width = this.props.rect ? this.props.rect.width : componentProps.style.width;
    const height = this.props.rect ? this.props.rect.height : componentProps.style.height;

    return (
      <CanvasElement
        {...pick(this.props, Object.keys(CanvasElementPropTypes))}
        resizeHorizontal={this.props.resizeHorizontal && !this.state.isEditing}
        resizeVertical={this.props.resizeVertical && !this.state.isEditing}
        canArrange={this.props.canArrange && !this.state.isEditing}
        getSize={this.getSize}
      >
        <div
          onMouseUp={this.handleMouseUp}
          onMouseDown={this.handleMouseDown}
          style={{ width, height }}
        >
          {this.state.isEditing ?
            <textarea
              style={{
                ...omit(componentProps.style, "position", "left", "top"),
                width: "100%",
                height: "100%"
              }}
              className={styles.editor}
              ref={el => { this.inputElement = ReactDOM.findDOMNode(el); }}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              onBlur={this.handleBlur}
              value={this.state.value}
            /> :
            <Syntax
              language={componentProps.language}
              theme={componentProps.theme}
              style={{
                ...omit(componentProps.style, "width", "height", "top", "left", "position"),
                width: "100%", height: "100%"
              }}
              source={componentProps.source || this.props.component.defaultText}
            />
          }
        </div>
      </CanvasElement>
    );
  }
}
