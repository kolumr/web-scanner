
const fullDate = (year,month,date)=>{
  if(date>9 && month>9){
return `${year}-${month}-${date}`
  }else if(date < 9 && month > 9){
    return `${year}-${month}-0${date}`
  }else if(date > 9 && month < 9){
    return `${year}-0${month}-${date}`
  }

  }
export const formatDate = () => {
  var date = new Date().getDate()
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear()
  return fullDate(year,month,date)
  }
