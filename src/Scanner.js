import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import React from "react";
import Html5QrcodePlugin from "./Html5-QrcodePlugin";
class Scanner extends React.Component {
    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback.
        this.onNewScanResult = this.onNewScanResult.bind(this);
       
    }
    
    render() {
        return (<div >
            <h2>Scan Barcode or QR code</h2>
            <Html5QrcodePlugin 
                fps={10}
                // qrbox={ width: 875, height: 1000 }
                disableFlip={false}
                qrCodeSuccessCallback={this.onNewScanResult}/>
        </div>);
    }

    onNewScanResult(decodedText, decodedResult) {
        // Handle the result here.
        console.log(decodedText)
        this.props.parentCallback(decodedText)
        Html5QrcodeScanner.stop().then((ignore) => {
            // QR Code scanning is stopped.
          }).catch((err) => {
            // Stop failed, handle it.
          });
          Html5QrcodeScanner.clear();
          Html5Qrcode.cameraStatus = false;
          
    }
  }
  export default Scanner;