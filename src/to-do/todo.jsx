import axios from "axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
export function ToDoApp() {
    const [appointments, setAppointments] = useState([]);
    const [toggleAdd, setToggleAdd] = useState({ display: 'block' });
    const [toggleEdit, setToggleEdit] = useState({ display: 'none' });
    const [editAppoint, setEditAppointment] = useState([{ Id: 0, Title: '', Date: '', Description: '' }]);

    const formik = useFormik({

        initialValues: {
            Id: appointments.length + 1,
            Title: '',
            Description: '',
            Date: new Date()
        },

        onSubmit: (appointment) => {
            axios.post('http://127.0.0.1:4000/addtask', appointment);
            alert('Appointment Added Successfully..');
            window.location.reload();
        }

    })

    const editFormik = useFormik({
        initialValues: {
            Id: editAppoint[0].Id,
            Title: editAppoint[0].Title,
            Date: `${editAppoint[0].Date.slice(0, editAppoint[0].Date.indexOf("T"))}`,
            Description: editAppoint[0].Description
        },
        enableReinitialize: true,
        onSubmit: (appointment) => {
            axios.put(`http://127.0.0.1:4000/edittask/${editAppoint[0].Id}`, appointment);
            alert('Appointment Modified Successfully..');
            window.location.reload();
        }
    })

    function LoadAppointments() {
        axios.get('http://127.0.0.1:4000/appointments')
            .then(response => {
                setAppointments(response.data);
            })
    }

    useEffect(() => {
        LoadAppointments();
    }, []);

    function handleDeleteClick(e) {
        var id = parseInt(e.target.value);
        var flag = window.confirm(`Are you sure\n Want to Delete?`);
        if (flag === true) {
            axios.delete(`http://127.0.0.1:4000/deletetask/${id}`);
            window.location.reload();
        }
    }

    function handleEditClick(id) {
        setToggleAdd({ display: 'none' });
        setToggleEdit({ display: 'block' });
        axios.get(`http://127.0.0.1:4000/appointments/${id}`)
            .then(response => {
                setEditAppointment(response.data);
                console.log(response.data);
            })


    }
    function handleCancelClick() {
        setToggleAdd({ display: 'block' });
        setToggleEdit({ display: 'none' });
    }
    return (
        <div className="container-fluid">
            <h1 className="text-center">To Do Project</h1>
            <header>
                <div aria-label="AddAppointment" style={toggleAdd} >
                    <label className="form-label fw-bold">Add New Appointment</label>
                    <div>
                        <form onSubmit={formik.handleSubmit} className="w-50">
                            <div className="d-flex">
                                <input type="hidden" name="Id" value={formik.values.Id} className="form-control" onChange={formik.handleChange} />
                                <input type="text" name="Title" onChange={formik.handleChange} className="form-control" placeholder="Title" />
                                <input type="date" name="Date" onChange={formik.handleChange} className="form-control" />
                            </div>
                            <div className="mt-2">
                                <label className="form-label fw-bold">Description</label>
                                <textarea name="Description" onChange={formik.handleChange} className="form-control">

                                </textarea>
                                <div className="mt-3">
                                    <button className="btn btn-primary">Add</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>


                <div aria-label="EditAppointment" style={toggleEdit} >
                    <label className="form-label fw-bold">Edit Appointment</label>
                    <div>
                        <form onSubmit={editFormik.handleSubmit} className="w-50">
                            <div className="d-flex">
                                <input type="number" name="Id" value={editFormik.values.Id} className="form-control" onChange={editFormik.handleChange} />
                                <input type="text" name="Title" value={editFormik.values.Title} onChange={editFormik.handleChange} className="form-control" placeholder="Title" />
                                <input type="date" name="Date" value={editFormik.values.Date} onChange={editFormik.handleChange} className="form-control" />
                            </div>
                            <div className="mt-2">
                                <label className="form-label fw-bold">Description</label>
                                <textarea name="Description" value={editFormik.values.Description} onChange={editFormik.handleChange} className="form-control">

                                </textarea>
                                <div className="mt-3">
                                    <button className="btn btn-success">Save</button>
                                    <button type="button" onClick={handleCancelClick} className="ms-2 btn btn-danger">Cancel</button>
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
                            appointments.map(appointment =>
                                <div className="alert alert-dismissible alert-success m-2 w-25" key={appointment.Id}>
                                    <button className="btn btn-close" value={appointment.Id} onClick={handleDeleteClick}></button>
                                    <div className="h5 alert-title">{appointment.Title}</div>
                                    <p>{appointment.Description}</p>
                                    <span className="bi bi-calendar"></span> {appointment.Date.slice(0, appointment.Date.indexOf("T"))}
                                    <div className="mt-3">
                                        <button onClick={() => { handleEditClick(appointment.Id) }} className="bi bi-pen-fill btn btn-warning"> Edit </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </main>
        </div>

    )
}