import Loder from 'components/loder/Loader';
import PostBox from 'components/posts/PostBox';
import { PostProps } from 'pages/Home'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import {doc, getDoc} from "firebase/firestore";
import { db } from 'firebaseApp';
import {IoIosArrowBack} from "react-icons/io"

function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if(params.id){
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef)

      setPost({...(docSnap?.data() as PostProps), id: docSnap?.id})
    }
  },[params.id]) 

  useEffect(() => {
    if(params.id){
      getPost();
    }
  }, [getPost, params.id])

  return (
    <div className='post'>
      <div className='post_header'>
        <button type='button' onClick={() => navigate(-1)}>
          <IoIosArrowBack className='post_header-btn'/>
        </button>
      </div>
      {post ? <PostBox post={post}/> : <Loder/>}
    </div>
  )
}

export default PostDetail