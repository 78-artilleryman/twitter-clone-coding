import React, { useContext } from 'react'

import { PostProps } from 'pages/Home';
import AuthContext from 'context/AuthContext';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { toast } from 'react-toastify';
import styles from "./Comment.module.scss"

export interface CommentProps{
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}

export interface CommentBoxProps {
  data: CommentProps;
  post: PostProps
}

function CommentBox({data, post}: CommentBoxProps) {
  const {user} = useContext(AuthContext)

  const handleDeleteComment =  async() => {
    if(post){
      try{
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          comments: arrayRemove(data)
        })
        toast.success("댓글 삭제했습니다.")
      }catch(e){

      }
    }
  }

  return (
    <div key={data?.createdAt} className={styles.comment}>
      <div className={styles.comment_borderBox}>
        <div className={styles.comment_imageBox}>
          <div className={styles.comment_flexBox}>
            <img src={`/logo192.png`} alt='profile'/>
            <div className={styles.comment_email}>{data?.email}</div>
            <div className={styles.comment_createdAt}>{data?.createdAt}</div>
          </div>
        </div>
        <div className={styles.comment_content}>{data?.comment}</div>
        <div className={styles.comment_submitDiv}>
        {data?.uid === user?.uid && (
          <button 
          type='button' 
          className={styles.comment_deleteBtn}
          onClick={handleDeleteComment}
          >
          삭제
          </button>
        )}
      </div>
      </div>
     
    </div>
  )
}

export default CommentBox