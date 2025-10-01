import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'

const successAlert = (title)=>{
   const alert =  Swal.fire({
  title: title,
  icon: "success",
  draggable: true
});
return alert;
}


export default successAlert;