import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';

function PostHeader() {

  const navigate = useNavigate();

  return (
    <div className='post_header'>
    <button type='button' onClick={() => navigate(-1)}>
      <IoIosArrowBack className='post_header-btn'/>
    </button>
  </div>
  )
}

export default PostHeader