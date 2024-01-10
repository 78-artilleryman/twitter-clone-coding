import PostForm from 'components/PostForm';
import PostBox from 'pages/posts/PostBox';

export interface PostProps{
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileURl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps [] = [
  {
    id: "1",
    email: "test@test.com",
    content: "test입니다",
    createdAt: "2023-11-11",
    uid: "123"
  },
  {
    id: "2",
    email: "test@test.com",
    content: "test입니다",
    createdAt: "2023-11-11",
    uid: "123"
  },
  {
    id: "3",
    email: "test@test.com",
    content: "test입니다",
    createdAt: "2023-11-11",
    uid: "123"
  },
  {
    id: "4",
    email: "test@test.com",
    content: "test입니다",
    createdAt: "2023-11-11",
    uid: "123"
  },
  {
    id: "5",
    email: "test@test.com",
    content: "test입니다",
    createdAt: "2023-11-11",
    uid: "123"
  },
  
]


function HomePage() {
  return (
    <div className='home'>
      <div className='home_title'>Home</div>
      <div className='home_taps'>
        <div className='home_tap home_tap--active'>For You</div>
        <div className='home_tap'>Following</div>
      </div>
      {/* Post Form*/}
      <PostForm/>
      {/* Tweet posts */}
      <div className='post'>
      {posts?.map((post) => (
        <PostBox post={post} key={post.id}/>
      ))}
      </div>
    </div>
  )
}

export default HomePage