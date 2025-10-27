import { Button } from '@mui/material'
import { Checkbox, CheckboxChangeEvent, DatePicker, Input, TimePicker } from 'antd'
import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import Schedule from '../Home/Schedule'

const NewShift = () => {

      const [sections, setSections] = useState<number[]>([1]); 
    
      const handleCustomizeWeeks = (e:CheckboxChangeEvent) => {
        if (e.target.checked) {
          setSections([1, 2, 3,4]); 
        } else {
          setSections([1]); 
        }
      };

      const navigate=useNavigate()
      const navSchedule=()=>{
        navigate("/Schedule")
      }
  return (
    <>
      <Schedule/>
    </>
  )
}

export default NewShift