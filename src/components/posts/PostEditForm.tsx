
import {FiImage} from "react-icons/fi"
import { useCallback, useContext, useEffect, useState } from "react"
import { collection, addDoc , doc, getDoc, updateDoc} from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/Home";
import { getDownloadURL, ref, uploadString , deleteObject} from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

function PostEditForm() {

  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null)
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [imageFile, setIamgeFile] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([]);
  const {user} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleFileUpload = (e: any) => {
    const {
      target: {files}
    } = e;

    const file = files?.[0];
  
    const fileReader = new FileReader();

    fileReader?.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {

      const { result } = e?.currentTarget;
      setIamgeFile(result);
    }
  }

  const getPost = useCallback(async() => {
    if(params.id){
      const docRef = doc(db, "posts" , params.id);
      const docSnap = await getDoc(docRef);
      setPost({...(docSnap?.data() as PostProps), id : docSnap.id})
      setContent(docSnap?.data()?.content)
      setTags(docSnap?.data()?.hashTags)
      setIamgeFile(docSnap?.data()?.imageUrl)
    }
  }, [params.id])

  const onSubmit = async (e: any) => {
    setIsSubmitting(true)
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key)
    e.preventDefault();

    try{
     if(post) {
      // 기존 사진 지우고 새로운 사진 업로드
      if(post?.imageUrl){
        let imageRef = ref(storage, post?.imageUrl)
        await deleteObject(imageRef).catch((error) => {
          console.log(error)
        })
      }

      // 새로운 파일 있다면 업로드
      let imageUrl = "";
      if(imageFile){
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref)
      }

      // 만약 사진이 아에 없다면 삭제
      const postRef = doc(db, "posts", post?.id);
      await updateDoc(postRef, {
        content: content,
        hashTags: tags,
        imageUrl: imageUrl,
      })
      toast.success("게시물이 수정되었습니다.")
      navigate(`posts/${post?.id}`);
     }
     setIamgeFile(null);
     setIsSubmitting(false)
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

  const handleDeleteImage = () => {
    setIamgeFile(null);
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
        id="file-input"
        accept='image/*' 
        onChange={handleFileUpload}
        className='hidden'
      />
      {imageFile && (
         <div className="post-form_attachment">
          <img src={imageFile} alt="attachment" width={100} height={100} />
          <button 
            className="post-form_clear-btn" 
         
            type="button" 
            onClick={handleDeleteImage}
            disabled={isSubmitting}
            >Clear
          </button>
         </div> 
        )}
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