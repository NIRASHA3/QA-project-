import React, { useEffect } from 'react'
import { Button, Col, Form, Input, message, Row } from "antd";
import '../resourses/authentication.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'

function Login() {
  // useDispatch hook from Redux: allows component to dispatch actions to the Redux store
  // Used here to show/hide loading indicators during API calls
  const dispatch = useDispatch()
  
  // useNavigate hook from React Router: enables programmatic navigation
  // Used to redirect users after successful login
  const navigate = useNavigate()
  
  // onFinish function: handles form submission
  // Triggered when the login form is submitted with valid data
  const onFinish = (values) => {
    // Dispatch showLoading action to indicate API call in progress
    dispatch({type: 'showLoading'})
    
    // Make POST request to login API endpoint with form values
    axios.post('/api/users/login', values).then((res) => {
      // On success: hide loading indicator, show success message,
      // store user data in localStorage, and redirect to home page
      dispatch({type: 'hideLoading'})
      message.success('Login successful')
      localStorage.setItem('pos-user', JSON.stringify(res.data))
      navigate('/home')
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
            <h3>Login</h3>
          
            <Form.Item name="userId" label="User ID">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type='password'/>
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <Link to='/register'>Not Yet Registered? Click Here To Register</Link>
              <Button htmlType="submit" type="primary">
                Login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Login