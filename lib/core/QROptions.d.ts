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
declare const defaultOptions: RequiredOptions;
export default defaultOptions;
