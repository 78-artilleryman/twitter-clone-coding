import {FaUserCircle} from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom';
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import { FaRegComment } from 'react-icons/fa';
import { PostProps } from "pages/Home";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import { ref, deleteObject } from "firebase/storage";
import {storage} from "firebaseApp"

interface PostBoxProps{
  post: PostProps;
}

function PostBox({post}: PostBoxProps) {

  const {user} = useContext(AuthContext)
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);

  const toggleLike = async() => {
    const postRef = doc(db, "posts" , post.id);

   
    if(user?.uid && post?.likes?.includes(user?.uid)){
       // 사용자가 좋아요를 미리 한 경우 -> 좋아요를 취소한다
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount -1 : 0,
      })
    }
    else{
       // 사용자가 좋아요를 하지 않은 경우 -> 좋아요를 추가한다
       await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount +1 : 1,
      })
    }

   
  }

  const handleDelete = async() => {
    const confirm = window.confirm("해당 게시물을 삭제하겠습니까?");

    if(confirm){
      //스토리지 이미지 먼저 삭제
      

      if(post?.imageUrl){
        deleteObject(imageRef).catch((error) => console.log(error))
      }

      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글이 삭제되었습니다.")
      navigate("/");
    }
  }

  return (
    <div className='post_box' key={post?.id}>
          <Link to={`/posts/${post?.id}`}>
            <div className='post_box-profile'>
              <div className='post_flex'>
                {post?.profileURl ? (
                  <img 
                    src={post?.profileURl} 
                    alt="profile" 
                    className='post_box-profile-img' 
                  />
                ) : (
                  <FaUserCircle className='post_box-profile-icon'/>
                )}
                <div className='post_email'>{post?.email}</div>
                <div className='post_createdAt'>{post?.createdAt}</div>
              </div>
              <div className='post_box-content'>{post?.content}</div>
              {post?.imageUrl && (
                <div className="post_image-div">
                  <img 
                    src={post?.imageUrl} 
                    alt="post img" 
                    className="post_image"
                    width={100}
                    height={100}
                    />
                </div>
              )}
              <div className="post-form_hashtags-outputs">
                {post?.hashTags?.map((tag, index) => (
                  <span className="post-form_hashtags-tag" key={index}>#{tag}</span>
                ))}
              </div>
            </div> 
          </Link>
          <div className='post_box-footer'>
            {user?.uid === post?.uid && (
              <>
              <button
                type='button'
                className='post_delete'
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type='button'
                className='post_edit'
              >
                <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
              </button>
            </>
            )}
            {/* post.uid === user.uid 일 때 */}
            
            <button
                type='button'
                className='post_likes'
                onClick={toggleLike}
              >
                {user && post?.likes?.includes(user?.uid) ? <AiFillHeart/> : <AiOutlineHeart/> }
             
                {post?.likeCount || 0}
              </button>
              <button
                type='button'
                className='post_comments'
              >
                <FaRegComment/>
                {post?.comments?.length || 0}
              </button>
          </div>
        </div>
  )
}

export default PostBox