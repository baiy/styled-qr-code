import qrTypes from "../constants/qrTypes";
import drawTypes from "../constants/drawTypes";
import errorCorrectionLevels from "../constants/errorCorrectionLevels";
import { DotType, Options, TypeNumber, ErrorCorrectionLevel, Mode, DrawType, Gradient, Multibyte } from "../types";

export interface RequiredOptions extends Options {
  type: DrawType;
  width: number;
  height: number;
  margin: number;
  data: string;
  qrOptions: {
    typeNumber: TypeNumber;
    mode?: Mode;
    errorCorrectionLevel: ErrorCorrectionLevel;
    multibyte: Multibyte;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    crossOrigin?: string;
    margin: number;
  };
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: Gradient;
  };
  backgroundOptions: {
    color: string;
    gradient?: Gradient;
  };
  useLegacyDotRotation: boolean;
}

const defaultOptions: RequiredOptions = {
  type: drawTypes.canvas,
  width: 300,
  height: 300,
  data: "",
  margin: 0,
  qrOptions: {
    typeNumber: qrTypes[0],
    mode: undefined,
    errorCorrectionLevel: errorCorrectionLevels.Q,
    multibyte: "default"
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    crossOrigin: "anonymous",
    margin: 0
  },
  dotsOptions: {
    type: "square",
    color: "#000"
  },
  backgroundOptions: {
    color: "#fff"
  },
  useLegacyDotRotation: false
};

export default defaultOptions;
