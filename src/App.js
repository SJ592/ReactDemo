import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  //employees array for display
  const [employee, setEmployee] = useState([]);

  //axios get request to fetch all the data
  const getEmployee = () =>{
          axios.get('http://localhost:4000/employees')
          .then(empList => setEmployee(empList.data))
          .catch(error => console.log(error))
  }

  useEffect(() => {
    //npx json-server employees.json --port 4000 --watch
    getEmployee();
  }, [])

  //object for adding new employee
  const [newEmp, setnewEmp] = useState({
    id:'', 
    empName:'', 
    empDsgn:'', 
    empLoc:''
  });

  // gives error initially, if uncommented after rendering pg it works?
  // auto increment
  // newEmp.id = parseInt(employee.slice(-1)[0].id)+1;

  //onChange form inputs
  const handleChange = (e) =>{

    const newData = {...newEmp}
    const field = e.target.name;
    const value = e.target.value;

    newData[field] = value;
    setnewEmp(newData);
    // setnewEmp({[field]:value});
    
  }
 
  //axios post request to add new employee
  const addEmployee = (e) =>{
    e.preventDefault();

    axios.post('http://localhost:4000/employees', newEmp)
    .then((response) => setEmployee([...employee, response.data]))
    .catch(error => console.log(error))

    setnewEmp({id:'', empName:'', empDsgn:'', empLoc:''})  //clearing all input fields after post req

  }

  //axios delete to delete an employee using id
  const deleteEmployee = (id, e) =>{
    e.preventDefault();
    axios.delete(`http://localhost:4000/employees/${id}`)
    .then(() => getEmployee())     //calling get to re render table after deletion of record
    .catch(error => console.log(error))
  }

  //this method fills the form input fields with the data for which update is to be performed
  const fillEmployee = (id, e) =>{
    e.preventDefault();

    axios.get(`http://localhost:4000/employees/${id}`)
    .then(employee => setnewEmp(employee.data))
    .catch(error => console.log(error))
  }

  //axios patch request for partially updating data
  const updateEmployee = (id, e) =>{
    e.preventDefault();

    axios.patch(`http://localhost:4000/employees/${id}`, newEmp)
    .then(() => getEmployee())
    .catch(error => console.log(error))

    setnewEmp({id:'', empName:'', empDsgn:'', empLoc:''})  //clearing all input fields after post req
  }

  //to display a specific employee details
  const searchEmployee = (id, e) =>{
    e.preventDefault();

    axios.get(`http://localhost:4000/employees/${id}`)
    .then(emp => setEmployee([emp.data]))   //without [] bracket it was giving error
    .catch(error => {console.log(error); alert("Employee not found")})

  }

  return (
    <div className="App">
      <br/>
      <form style={{margin:'auto'}} id='myForm'>
        <h4>AXIOS DEMO</h4>
        <div style={{display:'inline-flex', padding:'10px'}}>
        <div className="mb-3" style={{paddingRight:'20px'}}>
          <label htmlFor="exampleInputEmail1" className="form-label">Employee ID</label>
          <input type="text" className="form-control" id="exampleInputEmail1" name='id' value={newEmp.id} onChange={(e)=>handleChange(e)}/>
        </div>
        <div className="mb-3" style={{paddingRight:'20px'}}>
          <label htmlFor="exampleInputEmail2" className="form-label">Employee Name</label>
          <input type="text" className="form-control" id="exampleInputEmail2" name='empName' value={newEmp.empName} onChange={(e)=>handleChange(e)}/>
        </div>
        <div className="mb-3" style={{paddingRight:'20px'}}>
          <label htmlFor="exampleInputPassword3" className="form-label">Employee Designation</label>
          <input type="text" className="form-control" id="exampleInputPassword3" name='empDsgn' value={newEmp.empDsgn} onChange={(e)=>handleChange(e)}/>
        </div>
        <div className="mb-3" style={{paddingRight:'20px'}}>
          <label htmlFor="exampleInputPassword4" className="form-label">Employee Location</label>
          <input type="text" className="form-control" id="exampleInputPassword4" name='empLoc' value={newEmp.empLoc} onChange={(e)=>handleChange(e)}/>
        </div>
        </div>
        <br/>
        <div style={{display:'inline-flex'}}>
          <button type="button" className="btn btn-info" onClick={addEmployee} style={{padding:'10px'}}>Add Employee</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="button" className="btn btn-success" onClick={(e)=>updateEmployee(newEmp.id,e)} style={{padding:'10px'}}>Submit Update</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="button" className="btn btn-secondary" onClick={(e)=>searchEmployee(newEmp.id,e)} style={{padding:'10px'}}>Search Employee</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="button" className="btn btn-primary" onClick={getEmployee} style={{padding:'10px'}}>Show All</button>
        </div>
      </form>
      <br/>
      
      <h4>Employee List</h4>
      <br/>
      <table className="table" style={{width:'60%', margin:'auto', border:'3px solid black'}}>
        <thead className="table-dark">
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Designation</th>
            <th>Employee Location</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {
              employee.map((emp)=>{
                return(<tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.empName}</td>
                  <td>{emp.empDsgn}</td>
                  <td>{emp.empLoc}</td>
                  <td><button type='button' className='btn btn-danger' onClick={(e)=>deleteEmployee(emp.id, e)}>Delete</button></td>
                  <td><button type="button" className="btn btn-warning" onClick={(e)=>fillEmployee(emp.id, e)}>Update</button></td>
                </tr>
                )
            })

          }  
        </tbody>
      </table>
      <br/>
    </div>
  );
}

export default App;
