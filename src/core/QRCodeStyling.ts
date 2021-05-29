import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import downloadURI from "../tools/downloadURI";
import QRCanvas from "./QRCanvas";
import QRSVG from "./QRSVG";
import drawTypes from "../constants/drawTypes";

import defaultOptions, { RequiredOptions } from "./QROptions";
import sanitizeOptions from "../tools/sanitizeOptions";
import { QRCode, Options, DownloadOptions } from "../types";
import qrcode from "qrcode-generator";

export default class QRCodeStyling {
  _options: RequiredOptions;
  _container?: HTMLElement;
  _canvas?: QRCanvas;
  _svg?: QRSVG;
  _qr?: QRCode;
  _canvasDrawingPromise?: Promise<void>;
  _svgDrawingPromise?: Promise<void>;

  constructor(options?: Partial<Options>) {
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;
    this.update();
  }

  static _clearContainer(container?: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
  }

  update(options?: Partial<Options>): void {
    QRCodeStyling._clearContainer(this._container);
    this._options = options ? sanitizeOptions(mergeDeep(this._options, options) as RequiredOptions) : this._options;

    if (!this._options.data) {
      return;
    }

    this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
    this._qr.make();

    if (this._options.type === drawTypes.canvas) {
      this._canvas = new QRCanvas(this._options);
      this._canvasDrawingPromise = this._canvas.drawQR(this._qr);
      this._svgDrawingPromise = undefined;
      this._svg = undefined;
    } else {
      this._svg = new QRSVG(this._options);
      this._svgDrawingPromise = this._svg.drawQR(this._qr);
      this._canvasDrawingPromise = undefined;
      this._canvas = undefined;
    }

    this.append(this._container);
  }

  append(container?: HTMLElement): void {
    if (!container) {
      return;
    }

    if (typeof container.appendChild !== "function") {
      throw "Container should be a single DOM node";
    }

    if (this._options.type === drawTypes.canvas) {
      if (this._canvas) {
        container.appendChild(this._canvas.getCanvas());
      }
    } else {
      if (this._svg) {
        container.appendChild(this._svg.getElement());
      }
    }

    this._container = container;
  }

  download(downloadOptions?: Partial<DownloadOptions> | string): void {
    if (!this._qr) throw "QR code is empty";
    let extension = "png";
    let name = "qr";

    //TODO remove deprecated code in the v2
    if (typeof downloadOptions === "string") {
      extension = downloadOptions;
      console.warn(
        "Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument"
      );
    } else if (typeof downloadOptions === "object" && downloadOptions !== null) {
      if (downloadOptions.name) {
        name = downloadOptions.name;
      }
      if (downloadOptions.extension) {
        extension = downloadOptions.extension;
      }
    }

    if (extension.toLowerCase() === "svg") {
      let promise, svg: QRSVG;

      if (this._svg && this._svgDrawingPromise) {
        svg = this._svg;
        promise = this._svgDrawingPromise;
      } else {
        svg = new QRSVG(this._options);
        promise = svg.drawQR(this._qr);
      }

      promise?.then(() => {
        //get svg source.
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg.getElement());

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        downloadURI(url, `${name}.svg`);
      });
    } else {
      let promise, canvas: QRCanvas;

      if (this._canvas && this._canvasDrawingPromise) {
        canvas = this._canvas;
        promise = this._canvasDrawingPromise;
      } else {
        canvas = new QRCanvas(this._options);
        promise = canvas.drawQR(this._qr);
      }

      promise?.then(() => {
        const data = canvas.getCanvas().toDataURL(`image/${extension}`);
        downloadURI(data, `${name}.${extension}`);
      });
    }
  }
}
