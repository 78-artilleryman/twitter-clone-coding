
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
  const [hashTag, setHashTag] = useState<string>("")
  const [tags, setTags] = useState<string[]>([]);
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
      setTags(docSnap?.data()?.hashTags)
    }
  }, [params.id])

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try{
     if(post) {
      const postRef = doc(db, "posts", post?.id);
      await updateDoc(postRef, {
        content: content,
        hashTags: tags,
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
  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag))
  }

  

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  }

  const handleKeyup = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== ""){
      //만약 같은 태그가 있다면 에러를 띄운다
      // 아니라면 태그를 생성해준다
      if(tags?.includes(e.target.value?.trim())){
        toast.error("같은 태그가 있습니다.")
      }
      else{
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]))
        setHashTag("")
      }
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
      <div className="post-form_hashtags">
      <span className="post-form_hashtags-outputs">
        {tags?.map((tag, index) => (
          <span 
            className="post-form_hashtags-tag" 
            key={index} 
            onClick={() => removeTag(tag)}
            >
              #{tag}
            </span>
        ))}
      </span>
      <input 
        className="post-form_input" 
        name="hashtag"
        id="hashtag"
        placeholder="해시태그 + 스페이스바 입력"
        onChange={onChangeHashTag}
        onKeyUp={handleKeyup}
        value={hashTag}
        />
    </div>
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