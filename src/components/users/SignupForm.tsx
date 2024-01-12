import React from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

function SignupForm() {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] =  useState<string>("");
  const [passwordConfirm, setPasswordConfirm] =  useState<string>("");
  const [error, setErorr] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("회원가입에 성공했습니다.")
      navigate("/login");
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
      else if(passwordConfirm?.length > 0 && value !== passwordConfirm){
        setErorr("비밀번호와 비밀번호 확인 값이 다릅니다. 다시 확인해주세요.")
      }
      else{
        setErorr("")
      }
    }
    if(name === 'password_confirm'){
      setPasswordConfirm(value);
      if(value?.length < 8){
        setErorr("비밀번호는 8자리 이상으로 입력해주세요")
      }
      else if(value !== password){
        setErorr("비밀번호와 값이 다릅니다. 다시 확인해주세요.")
      }
      else{
        setErorr("")
      }
    }
  }
  
  return (
    <form onSubmit={onSubmit} className='form form--lg'>
      <div className="form_title"></div>
      <div className="form_block">
        <label htmlFor="email">이메일</label>
        <input type="text" name='email' id='email' value={email} onChange={onChange} required />
      </div>
      <div className="form_block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" name='password' id='password' onChange={onChange} value={password} required />
      </div>
      <div className="form_block">
        <label htmlFor="password_confirm">비밀번호 확인</label>
        <input type="password" name='password_confirm' id='password_confirm' onChange={onChange} value={passwordConfirm} required />
      </div>
      {error && error?.length > 0 && (
        <div className="form_block">
          <div className="form_error">{error}</div>
       </div>
      )}
      <div className="form_block">
        계정이 있으신가요?
        <Link to="/login" className='form_link'>로그인하기</Link>
      </div>
      <div className="form_block">
       <button type='submit' className='form_btn--submit' disabled={error?.length > 0}>회원가입</button>
      </div>
    </form>
  )
}

export default SignupForm