declare module 'react-otp-input' {
    import * as React from 'react';
  
    interface OtpInputProps {
      value: string;
      onChange: (otp: string) => void;
      numInputs: number;
      separator?: React.ReactNode;
      isDisabled?: boolean;
      shouldAutoFocus?: boolean;
      isInputNum?: boolean;
      isInputSecure?: boolean;
      placeholder?: string;
      containerStyle?: string;
      inputStyle?: string;
      focusStyle?: string;
      disabledStyle?: string;
      hasErroredStyle?: string;
      errorStyle?: string;
    }
  
    const OtpInput: React.FC<OtpInputProps>;
  
    export default OtpInput;
  }
  