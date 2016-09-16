import React, { Component, PropTypes } from "react";
import { debounce } from "lodash";

import { IMAGE, ERROR } from "../../../assets/icons";
import styles from "./fileupload.css";
import commonStyles from "../index.css";
import notificationSystem from "../../../notifications";
import classNames from "classnames";

const ERR_MAP = {
  NOT_FOUND_ERR: "File not found",
  NOT_READABLE_ERR: "File not readable",
  ABORT_ERR: "Reading the file was aborted",
  SECURITY_ERR: "Security error while reading file",
  ENCODING_ERR: "File too large"
};

const normalizeUrl = (url) => {
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
    return url;
  }
  return `http://${url}`;
};

export default class FileUpload extends Component {
  static propTypes = {
    maxSize: PropTypes.number,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    imageName: PropTypes.string,
    src: PropTypes.string,
    placeholder: PropTypes.string,
    contextData: PropTypes.object
  }

  static defaultProps = {
    contextData: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      sourceValue: ""
    };
  }

  /*
   * Clear sourceValue if we have a props.src
   */

  componentWillReceiveProps(nextProps) {
    if (nextProps.src) {
      this.setState({
        sourceValue: ""
      });
    }
  }

  /*
   * Get image dimensions by fetching image
   */

  getImageDimensions(src, cb) {
    const imageElement = new Image();

    // success handler
    imageElement.addEventListener("load", () => {
      const { width, height } = imageElement;
      cb(null, { width, height });
    });

    // error handler
    imageElement.addEventListener("error", () => {
      cb("Unable to read image");
    });

    // load image
    imageElement.src = src;
  }

  /*
   * Handle the image upload. Encode, read dimensions, then emit
   */

  handleImageUpload = (ev) => {
    const imageObj = ev.target.files && ev.target.files[0];
    if (!imageObj) return;

    const { name, size } = imageObj;

    if (size >= this.props.maxSize) {
      return this.showError("Image must be smaller than 3MB");
    }

    const contextData = { ...this.props.contextData };
    this.encodeFile(imageObj, (err, src) => {
      if (err) return this.showError(err);

      this.getImageDimensions(src, (err2, dimensions) => {
        if (err2) return this.showError(err2);

        this.props.onChange({
          ...dimensions,
          imageName: name,
          src
        }, contextData);

        this.setState({ sourceValue: "" });
      });
    });
  }


  /*
   * Encode a local file path to a data URI
   */

  encodeFile(file, cb) {
    const reader = new FileReader();

    // success handler
    reader.addEventListener("load", (e) => {
      cb(null, e.target.result);
    });

    // error handler
    reader.addEventListener("error", (e) => {
      cb(ERR_MAP[e.target.error.code] || "Error reading file");
    });

    // load image
    reader.readAsDataURL(file);
  }

  /*
   * Show an error notification
   */

  showError = (message) => {
    notificationSystem.addNotification({
      level: "error",
      message
    });
  }


  /*
   * Debounced source change handler, calls updateImage after 500ms of no activity.
   */

  debouncedSourceChange = debounce((value, contextData) => {
    this.updateImage(value, contextData);
  }, 500);

  /*
   * Update image with URL. Fetches image dimensions then emits change if valid
   */

  updateImage = (value, contextData) => {
    const src = normalizeUrl(value);

    // bail if less than 10 chars normalized
    if (src.length < 10) return this.setState({ invalid: false, loading: null });

    this.setState({ loading: src });

    // get dimensions then emit onChange
    this.getImageDimensions(src, (err, dimensions) => {
      // error fetching image
      if (err) return this.setState({ invalid: true, loading: null });

      // bail if input has changed since we started fetching
      if (value !== this.state.sourceValue || src !== this.state.loading) return;

      this.props.onChange({
        ...dimensions,
        imageName: null,
        src
      }, contextData);

      this.setState({ sourceValue: "", invalid: false, loading: null });
    });
  }

  /*
   * Set internal state, then debounce event propagation
   */

  handleSourceChange = (e) => {
    this.setState({ sourceValue: e.target.value, invalid: false, loading: null });
    this.debouncedSourceChange(e.target.value, { ...this.props.contextData });
  }

  /*
   * Cancel debounced handler, then updateImage.
   */

  handleSourceBlur = (e) => {
    this.debouncedSourceChange.cancel();
    this.updateImage(e.target.value, { ...this.props.contextData });
  }

  /*
   * Handle clearing out the uploader
   */

  handleClearClicked = () => {
    this.props.onClear();
  }

  renderLoading = () => (
    <div className={styles.spinner}>
      <div className={styles.doubleBounce1}></div>
      <div className={styles.doubleBounce2}></div>
    </div>
  )

  /*
   * Render the inputs for uploading or entering in a URL
   */

  renderInputs() {
    const inputClasses = classNames({
      globalInput: true,
      [styles.inputHasIcon]: this.state.invalid || this.state.loading
    });

    return (
      <div>
        <input
          type="text"
          className={inputClasses}
          placeholder={this.props.placeholder}
          onChange={this.handleSourceChange}
          onBlur={this.handleSourceBlur}
          value={this.state.sourceValue}
        />
        {this.state.invalid && !this.state.loading ?
          <div
            className={styles.errorIcon}
            title="Unable to load image"
            dangerouslySetInnerHTML={{ __html: ERROR }}
          /> : null}
        {this.state.loading ? this.renderLoading() : null}
        <div className={`${commonStyles.breakHr} ${styles.breakHr}`}>
          <div className={commonStyles.breakTitle}>OR</div>
        </div>
        <label className={`globalButton ${styles.fileUpload}`}>
          Upload an image...
          <input
            className={styles.visuallyHidden}
            type="file"
            accept="image/x-png, image/gif, image/jpeg, image/svg+xml"
            onChange={this.handleImageUpload}
          />
        </label>
      </div>
    );
  }

  /*
   * Render clearable state of the file uploader
   */

  renderClearable() {
    const { imageName, src } = this.props;
    return (
      <div className={styles.form}>
        <div className={styles.uploadedFile}>
          <span
            className={styles.uploadedFileIcon}
            dangerouslySetInnerHTML={{ __html: IMAGE }}
          >
          </span>
          <span className={styles.uploadedFileName} title={imageName || src}>
            {imageName || src}
          </span>
        </div>
        <button
          className={`globalButton ${styles.fileUpload} ${styles.removeButton}`}
          onClick={this.handleClearClicked}
        >
          Remove image
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.src ? this.renderClearable() : this.renderInputs()}
      </div>
    );
  }
}
