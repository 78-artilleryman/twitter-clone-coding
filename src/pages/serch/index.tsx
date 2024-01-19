import PostBox from 'components/posts/PostBox'
import AuthContext from 'context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages/Home';
import React, { useContext } from 'react'
import { useState, useEffect } from 'react';

function Serch() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("")
  const {user} = useContext(AuthContext)

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value?.trim())
  }

  useEffect(() => {
    if(user){
      let postsRef = collection(db, "posts");
      let postsQuery = query(
          postsRef,
          where("hashTags", "array-contains-any", [tagQuery]),
          orderBy("createdAt", "desc")
        )
        onSnapshot(postsQuery, (snapShot) => {
          let dataObj = snapShot?.docs?.map((doc) => ({
            ...doc?.data(),
            id: doc?.id
          }))

          setPosts(dataObj as PostProps[])
        })
    }
  }, [tagQuery, user])

  return (
    <div className='home'>
      <div className='home_top'>
        <div className="home_title">
          <div className='home_title-text'>Search</div>
        </div>
        <div className='home_search-div'>
          <input className='home_search' placeholder='해시태그 검색' type="text"  onChange={onChange}/>
        </div>
      </div>
      <div className='post'>
      {posts?.length > 0 ? posts?.map((post) => (
        <PostBox post={post} key={post.id}/>
      )): 
      <div className='post_no-posts'>
        <div className='post_text'>글이 없습니다.</div>
      </div>
      }
      </div>
    </div>
  )
}

export default Serch