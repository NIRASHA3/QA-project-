import React, { useEffect } from 'react'
import { Button, Col, Form, Input, message, Row } from "antd";
import '../resourses/authentication.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'

function Register() {
  // useDispatch hook from Redux: allows component to dispatch actions to the Redux store
  // Used here to show/hide loading indicators during API calls
  const dispatch = useDispatch()
  
  // useNavigate hook from React Router: enables programmatic navigation
  // Used to redirect users after successful registration
  const navigate = useNavigate()
  
  // onFinish function: handles form submission
  // Triggered when the registration form is submitted with valid data
  const onFinish = (values) => {
    // Dispatch showLoading action to indicate API call in progress
    dispatch({type: 'showLoading'})
    
    // Make POST request to register API endpoint with form values
    axios.post('/api/users/register', values).then((res) => {
      // On success: hide loading indicator and show success message
      dispatch({type: 'hideLoading'})
      message.success('Registration successful, please wait for verification')
    }).catch(() => {
      // On error: hide loading indicator and show error message
      dispatch({type: 'hideLoading'})
      message.error('Something went wrong')
    })
  }
  
  // useEffect hook: runs after component mounts and when dependencies change
  // Empty dependency array means this runs only once after component mounts
  // Purpose: Check if user is already logged in and redirect to home if true
  useEffect(() => {
    if(localStorage.getItem('pos-user')) {
      navigate('/home')
    }
  }, []) // Empty dependency array ensures this runs only once
  
  return (
    <div className='authentication'>
      <Row>
        <Col lg={8} xs={22}>
          <Form
            layout="vertical"
            onFinish={onFinish} // Assign the onFinish handler to the form
          >
            <h2><b>AURAPOS</b></h2>
            <hr />
            <h3>Register</h3>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="userId" label="User ID">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type='password'/>
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <Link to='/login'>Already Registered? Click Here To Login</Link>
              <Button htmlType="submit" type="primary">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Register