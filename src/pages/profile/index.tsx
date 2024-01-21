import PostBox from 'components/posts/PostBox'
import AuthContext from 'context/AuthContext'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from 'firebaseApp'
import { PostProps } from 'pages/Home'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROFILE_DEFAULT_URL = "/logo512.png";

type TabType = "my" | "like"

function ProfilePage() {
  const [activeTap, setActiveTap] = useState<TabType>("my")
  const [myPosts, setMyPosts] = useState<PostProps[]>([])
  const [likePosts, setLikePosts] = useState<PostProps[]>([])
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      let postRef = collection(db, "posts");

      const myPostquery = query(postRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"))
      const likePostquery = query(postRef, where("likes", "array-contains", user.uid), orderBy("createdAt", "desc"))

      onSnapshot(myPostquery, (snapShop) => {
        let dataObj = snapShop.docs.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObj as PostProps[]);
      });

      onSnapshot(likePostquery, (snapShop) => {
        let dataObj = snapShop.docs.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObj as PostProps[]);
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
 
        <div className={`home_tap ${activeTap === "my" && "home_tap--active"}`} onClick={() => setActiveTap("my")}>For You</div>
        <div className={`home_tap ${activeTap === "like" && "home_tap--active"}`} onClick={() => setActiveTap("like")}>Likes</div>
      </div>
   
        {activeTap === "my" && (
             <div className='post'>
             {myPosts?.length > 0 ? (
               myPosts?.map((post) => <PostBox post={post} key={post.id}/>)
             ) : (
               <div className='post_no-posts'>
                 <div className='post_text'>게시글이 없습니다.</div>
               </div>
             )}
             </div>
        )}

        {activeTap === "like" && (
             <div className='post'>
             {likePosts?.length > 0 ? (
               likePosts?.map((post) => <PostBox post={post} key={post.id}/>)
             ) : (
               <div className='post_no-posts'>
                 <div className='post_text'>게시글이 없습니다.</div>
               </div>
             )}
             </div>
        )}
   
    </div>
    </div>
    
  )
}

export default ProfilePage