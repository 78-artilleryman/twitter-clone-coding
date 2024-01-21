import PostHeader from 'components/posts/PostHeader'
import AuthContext from 'context/AuthContext';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { FiImage } from 'react-icons/fi';
import { ref , deleteObject, uploadString, getDownloadURL} from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { storage } from 'firebaseApp';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com"

function ProfileEdit() {
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {value}
    } = e;

    setDisplayName(value)
  }

  const onsubmit = async(e: any) =>{
    e.preventDefault();

    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;
    try{
      //기존 이미지 삭제
      if(user?.photoURL && user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)) {
        const imageRef = ref(storage, user?.photoURL);
        if(imageRef){
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          })
        }
      }
      // 이미지 업로드
      if(imageUrl){
        const data = await uploadString(storageRef, imageUrl, "data_url");
        newImageUrl = await getDownloadURL(data?.ref)
      }
      // updateProfile 호출
      if(user){
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImageUrl || "",
        }).then(() => {
          toast.success("프로필이 업데이트 되었습니다.")
          navigate('/profile')
        }).catch((error) => {
          console.log(error)
        })
      }
     

    }catch(e: any){
      console.log(e)
    }
  }

  const handleFileupload = (e: any) => {
    const {
      target: {files}
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const {result} = e?.currentTarget;

      setImageUrl(result);
    }
  }

  const handleDeleteImage = () => {
    setImageUrl(null);
  }

  useEffect(() => {
    if(user?.photoURL){
      setImageUrl(user?.photoURL)
    }
    if(user?.displayName){
      setDisplayName(user?.displayName)
    }
   
  },[user?.photoURL, user?.displayName])

  return (
    <div className='post'>
      <PostHeader/>
      <form className='post-form' onSubmit={onsubmit}>
        <div className='post-form_profile'>
          <input 
            type="text" 
            name='displayName'
            className='post-form_input'
            placeholder='이름'
            onChange={onchange}
            value={displayName}
          />
          {imageUrl && (
            <div className='post-form_attachment'>
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button 
                type='button' 
                onClick={handleDeleteImage} 
                className='post-form_clear-btn'
              >삭제
              </button>
            </div>
          )}
          <div className='post-form_submit-area'>
            <div className='post-form_image-area'>
              <label className='post-form_file' htmlFor='file-input'>
                <FiImage className='post-form_file-icon'/>
              </label>
            </div>
            <input 
              type="file"
              name='file-input'
              id='file-input'
              accept='image/*'
              className='hidden'
              onChange={handleFileupload}
            />
            <input 
              type="submit"
              value='프로필 수정'
              className='post-form_submit-btn'
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileEdit