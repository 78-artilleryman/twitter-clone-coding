import {FaUserCircle} from "react-icons/fa"
import { Link } from 'react-router-dom';
import {AiFillHeart} from "react-icons/ai"
import { FaRegComment } from 'react-icons/fa';
import { PostProps } from "pages/Home";

interface PostBoxProps{
  post: PostProps;
}

function PostBox({post}: PostBoxProps) {

  const handleDelete = () => {

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
            </div> 
          </Link>
          <div className='post_box-footer'>
            {/* post.uid === user.uid 일 때 */}
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
            <button
                type='button'
                className='post_likes'
              >
                <AiFillHeart/>
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