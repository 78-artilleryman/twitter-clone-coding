import AuthContext from 'context/AuthContext';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages/Home'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';

export interface CommentFormProps{
  post: PostProps | null;
}

function CommentForm({post}: CommentFormProps) {

  const [comment, setComment] = useState<string>("");
  const {user} = useContext(AuthContext)

  const onSubmit = async(e: any) => {
    e.preventDefault();

    if(post && user){
      const postRef = doc(db, "posts", post?.id);

      const commentobj = {
        comment: comment,
        uid: user?.uid,
        email: user?.email,
        createdAt: new Date()?.toLocaleDateString("ko",{
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }

      await updateDoc(postRef, {
        comments: arrayUnion(commentobj)
      })

      toast.success("댓글 생성")
      setComment("");
      try{

      }catch(e: any){
        console.log(e)
      }
    }
  }

  const onchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: {name, value},
    } = e;

    if(name === 'comment'){
      setComment(value);
    }
  }
  return (
    <form action="" className='post-form' onSubmit={onSubmit}>
      <textarea
        className='post-form_textarea'
        name='comment'
        id='comment'
        required
        placeholder='what is happening?'
        onChange={onchange}
        value={comment}
      />
      <div className='post-form_submit-area'>
        <div></div>
        <input
          type='submit'
          value="Commit"
          className='post-form_submit-btn'
          disabled={!comment}
        />
      </div>
    </form>
  )
}

export default CommentForm