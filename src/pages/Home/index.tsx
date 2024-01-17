import PostForm from 'components/posts/PostForm';
import PostBox from 'components/posts/PostBox';
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import AuthContext from 'context/AuthContext';
import { db } from 'firebaseApp';

export interface PostProps{
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileURl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashTags: string[];
}


function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const {user} = useContext(AuthContext)

  useEffect(() => {
    if(user){
      let postRef = collection(db, "posts");
      let postsQuer = query(postRef, orderBy("createdAt", "desc"))

      onSnapshot(postsQuer, (snapShop) => {
        let dataObj = snapShop.docs.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  },[])

  return (
    <div className='home'>
      <div className="home_top">
        <div className='home_title'>Home</div>
        <div className='home_taps'>
          <div className='home_tap home_tap--active'>For You</div>
          <div className='home_tap'>Following</div>
        </div>
      </div>
      {/* Post Form*/}
      <PostForm/>
      {/* Tweet posts */}
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

export default HomePage