import PostBox from 'components/posts/PostBox'
import AuthContext from 'context/AuthContext'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from 'firebaseApp'
import { PostProps } from 'pages/Home'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROFILE_DEFAULT_URL = "/logo512.png";

function ProfilePage() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      let postRef = collection(db, "posts");
      let postsQuer = query(postRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"))

      onSnapshot(postsQuer, (snapShop) => {
        let dataObj = snapShop.docs.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  },[user])

  return (
    <div className='home'>
    <div className="home_top">
      <div className='home_title'>Profile</div>
      <div className='profile'>
        <img 
          src={user?.photoURL || PROFILE_DEFAULT_URL} 
          alt="profile" 
          className='profile_image'
          width={100}
          height={100}
        />
        <button 
          type='button'
          className='profile_btn'
          onClick={() => navigate("/profile/edit")}
        >
          프로필 수정
        </button>
      </div>
      <div className='profile_text'>
        <div className='profile_name'>{user?.displayName || "사용자님"}</div>
        <div className='profile_email'>{user?.email}</div>
      </div>
      <div className='home_taps'>
        <div className='home_tap home_tap--active'>For You</div>
        <div className='home_tap'>Likes</div>
      </div>
      <div className='post'>
      {posts?.length > 0 ? (
        posts?.map((post) => <PostBox post={post} key={post.id}/>)
      ) : (
        <div className='post_no-posts'>
          <div className='post_text'>게시글이 없습니다.</div>
        </div>
      )}
      </div>
    </div>
    </div>
    
  )
}

export default ProfilePage