import React,{useEffect, useState} from "react";

import {Button,Container,TextField,Snackbar} from '@mui/material';
import { items } from "./csvjson";
import {formatDate} from './helpers/format'
import { LoadingButton } from '@mui/lab';
import { useSearchParams } from "react-router-dom";
import Scanner from "./Scanner";

function App() {
  const [data, setData] = React.useState("Not Found");
  const [torchOn, setTorchOn] = React.useState(false);
  const [open, setOpen] =useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBarCodeVisible, setIsBarCodeVisible] = React.useState(false);
  const [newWarrantyReg, setNewWarrantyReg] = useState({
    UserId:20,
    ModelNo: "",
    SerialNo: "",
    DateOfPurchase: formatDate() ,
    DateOfRegistration: formatDate(),
    
  })
  const scannerElement = document.getElementById('scanner');
  const parentElement = document.getElementById('parent');
//  useEffect(()=>{
//   const [searchParams] = useSearchParams();
//   setNewWarrantyReg({...newWarrantyReg,userId:searchParams?.userId})
//  },[])
  const getBarcode = async (code) =>{
   const item = items.filter((item)=>{
    if (item.Barcode === code){
      return item.ModelNo;
    }
  return false})
    setNewWarrantyReg({...newWarrantyReg,ModelNo:item[0]?.ModelNo})
    
  }
  const handleBarCodeScanned = (data) => {
    alert('Scanning successful, stop scanning')
    if(data.indexOf(";") === -1){
      getBarcode(JSON.parse(data));
      
    }else{
      const data1= data.split(";")
      setNewWarrantyReg({...newWarrantyReg,ModelNo:data1[0],
      SerialNo:data1[1]})
      
      }
  };
  const handleWarrantyReg = async () =>{
    setIsLoading(true)
    // let token = await sessionStorage.getItem('authToken')
    let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbWlrYWFwcGxpYW5jZXMuY29tIiwiaWF0IjoxNjYwNzQ0NjczLCJuYmYiOjE2NjA3NDQ2NzMsImV4cCI6MTY2MTM0OTQ3MywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoyLCJkZXZpY2UiOiIiLCJwYXNzIjoiMTQwYjY4OWJlMmIxMmQ3Mjc4MTgyNzNkMGNmNGI5MzgifX19.QJAzbUeBYBXueK9cYNgE_IjcelMaowO9YMw1SS6Vpk8"
    console.log(newWarrantyReg);
    try{
      let response = await fetch(`https://mikaappliances.com/wp-json/add/warranty`, {
        method: 'POST',
        headers: {
          authorization: token ? `Bearer ${token}}` : "",
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(newWarrantyReg)
    });
    let json = await response.json();
      console.log(json);
      if (json.status != false) {
        setIsLoading(false);
        setOpen(true);
        setTimeout(()=>{setOpen(false)}, 3000)
      } 
      
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      // Alert.alert("Error", JSON.stringify(error))
      console.log(error);
    }
  }
  return (
    <div >
      <Container>
        <div style={{width:'300px'}}>
        <Scanner parentCallback={handleBarCodeScanned} id='scanner'/>
        </div>
        {/* <TextField style={styles.inputs} id="filled-basic" label="customer Id" variant="outlined" value={newWarrantyReg.UserId}/><br/>
         */}
         <TextField style={styles.inputs} id="filled-basic" label="Purchase from" variant="outlined" value={newWarrantyReg.purchased_from}/><br/>
         <TextField style={styles.inputs} id="filled-basic" label="Town of Purchase" variant="outlined" value={newWarrantyReg.TownPurchase}/><br/>
        <TextField style={styles.inputs} id="filled-basic" label="Model Number" variant="outlined" value={newWarrantyReg.ModelNo}/><br/>
        <TextField style={styles.inputs} id="filled-basic" label="Serial Number" variant="outlined" value={newWarrantyReg.SerialNo} /><br/>
        <TextField style={styles.inputs} id="filled-basic" label="Date of Purchase" variant="outlined" value={newWarrantyReg.DateOfPurchase}/><br/>
        <div style={styles.inputs} >Warranty period : </div>
        <LoadingButton loading={isLoading} style={styles.inputs} variant="contained" onClick={()=> handleWarrantyReg()}>Register Warranty</LoadingButton><br/>
        <a style={styles.inputs} href="https://mikaappliances.com/terms-conditions/" target="_blank" rel="noreferrer"> Terms & Conditions</a>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          message="warranty created successfully"
        />
      </Container>
    </div>
  );
}

export default App;
const styles = {
  inputs:{
    margin:'10px'
  }
}