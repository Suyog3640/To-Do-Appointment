import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik"
import * as yup from "yup";
import './todo.css';

export function ToDoApp()
{
    const[appointments, setAppointments] = useState([]);
    const[toggleAdd, setToggleAdd] = useState({display:'block'});
    const[toggleEdit, setToggleEdit] = useState({display:'none'});
    const[editAppointment, setEditAppointment] = useState([{Id:0, Title:'', Date:'', Description:''}]);

    const formik = useFormik({
        initialValues:{
            Id: appointments.length + 1,
            Title: '',
            Date: new Date(),
            Description: ''
        },
        validationSchema: yup.object({
            Title: yup.string().required("Title Required").max(25,"Title must be at most 25 characters"),
            Date: yup.date().required("Date Required").min(new Date(),"Must be above current date"),
            Description: yup.string().required("Description Required").max(150,"Description must be at most 150 characters")
        }),
        onSubmit: (appointment) => {
            axios.post('http://127.0.0.1:4000/addtask', appointment);
            alert('Appointment Added Successfully..');
            window.location.reload();
        }

    })

    const editFormik = useFormik({
        initialValues:{
            Id: editAppointment[0].Id,
            Title: editAppointment[0].Title,
            Date: `${editAppointment[0].Date.slice(0,editAppointment[0].Date.indexOf("T"))}`,
            Description: editAppointment[0].Description
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            Title: yup.string().required("Title Required").max(25,"Title must be at most 25 characters"),
            Date: yup.date().required("Date Required").min(new Date(),"Must be above current date"),
            Description: yup.string().required("Description Required").max(150,"Description must be at most 150 characters")
        }),
        onSubmit: (appointment) => {
            axios.put(`http://127.0.0.1:4000/edittask/${editAppointment[0].Id}`, appointment);
            alert('Appointment Modified Successfully..');
            window.location.reload();
        }  
    })

    function LoadAppointments(){
        axios.get('http://127.0.0.1:4000/appointments')
        .then(response=>{
           setAppointments(response.data);
        })
    }

    function handleDeleteClick(e){
        var id = parseInt(e.target.value);
        var flag = window.confirm(`Are You Sure\nWant To Delete`);
        if(flag===true){
            axios.delete(`http://127.0.0.1:4000/deletetask/${id}`);
            window.location.reload();
        }
    }

    function handleEditClick(id){
        setToggleAdd({display:'none'});
        setToggleEdit({display:'block'});

        axios.get(`http://127.0.0.1:4000/appointments/${id}`)
        .then(response=>{
            setEditAppointment(response.data);
        })
    }

    function handleCancelClick(){
        setToggleAdd({display:'block'});
        setToggleEdit({display:'none'});
    }   

    useEffect(()=>{
        LoadAppointments();
    },[]);

    return(
        <div className="bg-image">
            <div className="bg-shade">
            <div className="container-fluid text-white">
            <h1 className="text-center bg-dark text-white p-2">To-Do - Your Appointments</h1>
            <header>
                <div aria-label="AddAppointment" style={toggleAdd}>
                    <label className="form-label fw-bold">Add New Appointment</label>
                    <div>
                        <form onSubmit={formik.handleSubmit} className="w-50">
                            <div>
                                <input type="number" name="Id" className="form-control" onChange={formik.handleChange} />
                                <dd></dd>
                                <input type="text" name="Title" onChange={formik.handleChange} className="form-control" placeholder="Title" />
                                <dd className="text-danger ms-1">{formik.errors.Title} </dd>
                                <input type="date" name="Date" onChange={formik.handleChange} className="form-control" />
                                <dd className="text-danger ms-1">{formik.errors.Date}</dd>
                            </div>
                            <div className="mt-2">
                                <label className="form-label fw-bold">Description</label>
                                <textarea name="Description" onChange={formik.handleChange} className="form-control">

                                </textarea>
                                <dd className="text-danger ms-1">{formik.errors.Description}</dd>
                                <div className="mt-3">
                                    <button className="btn btn-dark">Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div aria-label="EditAppointment" style={toggleEdit}>
                    <label className="form-label fw-bold">Edit Appointment</label>
                    <div>
                        <form onSubmit={editFormik.handleSubmit} className="w-50">
                            <div>
                                <input type="number" name="Id" value={editFormik.values.Id} className="form-control" onChange={editFormik.handleChange} />
                                <dd></dd>
                                <input type="text" name="Title" value={editFormik.values.Title} onChange={editFormik.handleChange} className="form-control" placeholder="Title" />
                                <dd className="text-danger ms-1">{editFormik.errors.Title} </dd>
                                <input type="date" name="Date" value={editFormik.values.Date} onChange={editFormik.handleChange} className="form-control" />
                                <dd className="text-danger ms-1">{editFormik.errors.Date}</dd>
                            </div>
                            <div className="mt-2">
                                <label className="form-label fw-bold">Description</label>
                                <textarea name="Description" value={editFormik.values.Description} onChange={editFormik.handleChange} className="form-control">

                                </textarea>
                                <dd className="text-danger ms-1">{editFormik.errors.Description}</dd>
                                <div className="mt-3">
                                    <button disabled={(editFormik.dirty)?false:true} className="btn btn-success">Save</button>
                                    <button type="button" onClick={handleCancelClick} className="btn btn-danger ms-2">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </header>
            <main className="mt-4">
                <div>
                    <label className="form-label fw-bold">Your Appointments</label>
                    <div className="d-flex flex-wrap">
                        {
                            appointments.map(appointment=>
                                <div className="alert alert-success alert-dismissible me-3" key={appointment.Id}>
                                    <button className="btn btn-close" value={appointment.Id} onClick={handleDeleteClick}></button>
                                    <div className="h5 alert-title">{appointment.Title}</div>
                                    <p>{appointment.Description}</p>
                                    <span className="bi bi-calendar me-2"></span>{appointment.Date.slice(0,appointment.Date.indexOf("T"))}
                                    <div className="mt-3">
                                        <button onClick={()=>{handleEditClick(appointment.Id)}} className="bi bi-pen-fill btn btn-warning"> Edit </button>
                                    </div>
                                </div>
                                )
                        }
                    </div>
                </div>
            </main>
        </div>
            </div>
        </div>
    )
}