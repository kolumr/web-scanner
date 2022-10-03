import React,{ useState} from "react";
import {Container,TextField,Snackbar, Button} from '@mui/material';
import { items } from "./csvjson";
import {formatDate} from './helpers/format'
import { LoadingButton } from '@mui/lab';
import { towns } from "./towns";
import Scanner from "./Scanner";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { dataLookUp } from "./data";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  const [open, setOpen] =useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelScanner, setisModelScanner] = React.useState(true);
  const [isBarCodeVisible, setIsBarCodeVisible] = React.useState(false);
  const [newWarrantyReg, setNewWarrantyReg] = useState({
    UserId:20,
    ModelNo: "",
    SerialNo: "",
    DateOfPurchase: '' ,
    DateOfRegistration: formatDate(),
    PurchaseDate:'',
    PurchaseTown:'',
    PurchasedFrom:"",
    WarrantyPeriod:"",
    ProductName:""
  })
  const purchaseWays = ['Mika Website', 'Mika Showroom', 'Supermarket','Shop','Other']
const handleReset = () => {
  setNewWarrantyReg({
    UserId:20,
    ModelNo: "",
    SerialNo: "",
    DateOfPurchase: '' ,
    DateOfRegistration: formatDate(),
    PurchaseDate:'',
    PurchaseTown:'',
    PurchasedFrom:"",
    WarrantyPeriod:"",
    ProductName:""
  })
}
  const getBarcode = async (code) =>{
    console.log("getBarcode")
    if(isModelScanner === false){
      console.log("Serial")
      setNewWarrantyReg({...newWarrantyReg, SerialNo:code})
    }else{
      items.filter((item)=>{
        if (item.Barcode === JSON.parse(code)){
          getProductDetails(item)
         
        }
      return false})
    }
  
    // setNewWarrantyReg({...newWarrantyReg,ModelNo:item[0]?.ModelNo})
    }

  const getProductDetails= (item)=>{
    dataLookUp.filter((data)=>{
      if(item.ModelNo === data.ModelNo){
        console.log(data)
        setNewWarrantyReg({...newWarrantyReg,ProductName:data.ItemName,WarrantyPeriod:data.WarrantyType,ModelNo:item.ModelNo})
      }
      return false;
    })
  }
  const handleBarCodeScanned = (data) => {
    console.log(data)
    console.log(isModelScanner)
    alert('Scanning successful, stop scanning')
    if(data.indexOf(";") === -1){
      getBarcode(data);
      
    }else{
      const data1= data.split(";")
      if(isModelScanner){}
      setNewWarrantyReg({...newWarrantyReg,ModelNo:data1[0],
        SerialNo:data1[1]})
      dataLookUp.filter((data)=>{
        if(data1[0] === data.ModelNo){
          console.log('found')
          return setNewWarrantyReg({...newWarrantyReg,ModelNo:data1[0],
            SerialNo:data1[1],ProductName:data.ItemName,WarrantyPeriod:data.WarrantyType})
        }
      })
      
      
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
      if (json.status !== false) {
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
      <Container maxWidth="sm">
        <h1> Welcome to the scanner app</h1>
        {isBarCodeVisible? 
        <div style={{marginLeft:'10px', width:'300px',marginBottom:"10px"}}>
        <Scanner parentCallback={handleBarCodeScanned} id='scanner'/>
        </div> : <div></div> }
        <select style={styles.selections} onSelect={(e)=>setNewWarrantyReg({...newWarrantyReg,PurchasedFrom:e.target.value})}>
        <option value="">-- Purchased from -- </option>
                    {purchaseWays.map((s, i) => <option key={i} value={s} >{s}</option>)}
        </select><br/>
        <select style={styles.selections} onSelect={(e)=>setNewWarrantyReg({...newWarrantyReg,PurchaseTown:e.target.value})}>
        <option value="">-- Select Town of purchase -- </option>
                    {towns.map((s, i) => <option key={i} value={s}>{s}</option>)}
        </select><br/>
        
        <TextField style={styles.inputs} id="filled-basic" label="Model Number" variant="outlined" value={newWarrantyReg.ModelNo}/> <br/>
        <Button style={styles.inputs} variant="contained" onClick={()=> setIsBarCodeVisible(!isBarCodeVisible)}>{isBarCodeVisible & isModelScanner? 'Close Scanner': 'Scan Model Number'}</Button> <br/>
        <TextField style={styles.inputs} id="filled-basic" label="Serial Number" variant="outlined" value={newWarrantyReg.SerialNo} /><br/>
         <Button style={styles.inputs} variant="contained" onClick={()=>{ setIsBarCodeVisible(!isBarCodeVisible); setisModelScanner(!isModelScanner)}}>{isBarCodeVisible & !isModelScanner? 'Close Scanner': 'Scan Serial Number'}</Button> <br/>
        <TextField style={styles.inputs} id="filled-basic" label="ProductName" variant="outlined" value={newWarrantyReg.ProductName} /><br/>
        <div style={styles.inputs}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="Date of Purchase"
              inputFormat="MM/DD/YYYY"
              value={newWarrantyReg.DateOfPurchase}
              onChange={(date)=>setNewWarrantyReg({...newWarrantyReg,DateOfPurchase:date})}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider> 
        </div>
        {newWarrantyReg.WarrantyPeriod? <TextField disabled='true' style={styles.inputs} id="filled-basic" label="Warranty Period" variant="outlined" value={newWarrantyReg.WarrantyPeriod} />: <div></div>}
        <br/>
        <LoadingButton loading={isLoading} style={styles.inputs} variant="contained" onClick={()=> handleWarrantyReg()}>Register Warranty</LoadingButton> <Button variant="outlined" onClick={handleReset}>Reset</Button><br/>
        <div style={styles.inputs}>
          <a  href="https://mikaappliances.com/warranty-terms-conditions/"> Terms & Conditions</a>
        </div>
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
  },
  selections:{
    border:'none',
    height:'40px',
    margin:'10px',
    width: '220px'
    
  }
}