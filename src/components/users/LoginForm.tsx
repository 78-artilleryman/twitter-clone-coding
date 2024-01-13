import React from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

function LoginForm() {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] =  useState<string>("");
  const [error, setErorr] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("로그인 되었습니다.")
      navigate("/");
    }catch(error:any){
      console.log(error)
      toast.error(error?.code)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target : {name, value}
    } = e;

    if(name === 'email'){
      setEmail(value);
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


      if(!value?.match(validRegex)){
        setErorr("이메일 형식이 올바르지 않습니다.")
      }
      else{
        setErorr("")
      }
    }
    if(name === 'password'){
      setPassword(value);
      if(value?.length < 8){
        setErorr("비밀번호는 8자리 이상으로 입력해주세요")
      }
      else{
        setErorr("")
      }
    }
  }
  
  return (
    <form onSubmit={onSubmit} className='form form--lg'>
      <div className="form_title">로그인</div>
      <div className="form_block">
        <label htmlFor="email">이메일</label>
        <input type="text" name='email' id='email' value={email} onChange={onChange} required />
      </div>
      <div className="form_block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" name='password' id='password' onChange={onChange} value={password} required />
      </div>
      {error && error?.length > 0 && (
        <div className="form_block">
          <div className="form_error">{error}</div>
       </div>
      )}
      <div className="form_block--lg">
        계정이 없으신가요?
        <Link to="/users/signup" className='form_link'>회원가입하기</Link>
      </div>
      <div className="form_block">
       <button type='submit' className='form_btn--submit' disabled={error?.length > 0}>로그인</button>
      </div>
    </form>
  )
}

export default LoginForm