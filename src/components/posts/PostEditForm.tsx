
import {FiImage} from "react-icons/fi"
import { useCallback, useContext, useEffect, useState } from "react"
import { collection, addDoc , doc, getDoc, updateDoc} from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/Home";

function PostEditForm() {

  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null)
  const [content, setContent] = useState<string>("");
  const {user} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleFileUpload = () => {

  }

  const getPost = useCallback(async() => {
    if(params.id){
      const docRef = doc(db, "posts" , params.id);
      const docSnap = await getDoc(docRef);
      setPost({...(docSnap?.data() as PostProps), id : docSnap.id})
      setContent(docSnap?.data()?.content)
    }
  }, [params.id])

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try{
     if(post) {
      const postRef = doc(db, "posts", post?.id);
      await updateDoc(postRef, {
        content: content,
      })
      toast.success("게시물이 수정되었습니다.")
      navigate(`posts/${post?.id}`);
     }
    }catch(e: any){
      console.log(e)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {target: {name, value}} = e

    if(name === "content"){
      setContent(value)
    }
  }

  useEffect(() => {
    if(params.id){
      getPost();
    }
  }, [getPost, params.id])
  
  return (
    <form className='post-form' onSubmit={onSubmit}>
    <textarea 
      className="post-form_textarea" 
      id="content"
      name='content'
      required
      placeholder='What is happening?'
      onChange={onChange}
      value={content}
      />
    <div className='post-form_submit-area'>
      <label htmlFor='file-input' className='post-form_file'>
        <FiImage className='post-form_file-icon'/>
      </label>
      <input 
        type="file" 
        name='file-input' 
        accept='image/*' 
        onChange={handleFileUpload}
        className='hidden'
      />
      <input 
        type="submit" 
        value="수정"
        className='post-form_submit-btn'
      />
    </div>
  </form>
  )
}

export default PostEditForm