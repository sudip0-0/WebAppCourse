import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom"
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate()

  const [course_name, setCourseName] = useState('');
  const [course_description, setCourseDescription] = useState('');

  const [edit_course_name, setEditCourseName] = useState('');
  const [edit_course_description, setEditCourseDescription] = useState('');
  const [edit_id, setEditID] = useState('');

  const [data, setData] = useState([]);
  
  useEffect(() => {

    if (!localStorage.getItem("user")) {
      navigate("/");
    }

    getData();
  }, []);

  const getData = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('https://localhost:7296/api/Course', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleSave = () => {
    const token = localStorage.getItem('token'); 
    const url = 'https://localhost:7296/api/Course';
    const data = {
        "course_Name": course_name,
        "course_Description": course_description
    }
    axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
    .then((result) => {
        getData();
        clear();
        toast.success("Course Added");
    })
    .catch((error) => {
        toast.error("Error ");
    })
  }

  const clear = () => {
    setCourseName('');
    setCourseName('');
    setEditCourseDescription('');
    setEditCourseName('');
    
  }
  
  const handleEdit = (id) => {
    handleShow();
    const token = localStorage.getItem('token'); 
    axios.get(`https://localhost:7296/api/Course/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
    .then((result) => {
        setEditCourseName(result.data.course_Name);
        setEditCourseDescription(result.data.course_Description);
        setEditID(id);
    })
    .catch((error) => {
        console.log(error)
    })
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete course?") === true) {
        const token = localStorage.getItem('token'); 
        axios.delete(`https://localhost:7296/api/Course/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        })
        .then((result) => {
            if (result.status === 200) {
                toast.success("Course Deleted")
                getData();
            }
        })
        .catch((error) => {
            toast.success("Error ")
        })
    }
  };

  const logout = () => {
    if(localStorage.getItem("user")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token"); 
      navigate("/");
    }
  }

  const handleUpdate = () => {
    const updatedCourse = {
        "id": edit_id,
        "course_Name": edit_course_name,
        "course_Description": edit_course_description
    };
    const token = localStorage.getItem('token'); 
    axios.put(`https://localhost:7296/api/Course/${edit_id}`, updatedCourse, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
    .then(response => {
        handleClose();
        console.log(response.data);
        toast.success("Course updated successfully");
        getData(); // Refresh the data
    })
    .catch(error => {
        console.error("Error updating course:", error);
        toast.error("Failed to update course");
    });
  };

  return (
    <Fragment>
        <ToastContainer/>
      <Container>
        
        <Row>
          <Col>
            <input 
              type="text" 
              className='form-control' 
              placeholder='Enter Course name' 
              value={course_name} 
              onChange={(e) => setCourseName(e.target.value)}
            />
          </Col>
          <Col>
            <input 
              type="text" 
              className='form-control' 
              placeholder='Enter Course Description' 
              value={course_description}  
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </Col>
          <Col>
            <button className='btn btn-primary' onClick={() => handleSave()}>Submit</button>
          </Col>
          <Col>
            <button className='btn btn-danger' onClick={logout}>Logout</button>
          </Col>
        </Row>
      </Container>

      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.course_Name}</td>
                <td>{item.course_Description}</td>
                <td colSpan={2}>
                  <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button>
                  <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input 
                type="text" 
                className='form-control' 
                placeholder='Enter Course name' 
                value={edit_course_name} 
                onChange={(e) => setEditCourseName(e.target.value)}
              />
            </Col>
            <Col>
              <input 
                type="text" 
                className='form-control' 
                placeholder='Enter Course Description' 
                value={edit_course_description}  
                onChange={(e) => setEditCourseDescription(e.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Dashboard;
