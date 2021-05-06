// pages/index.js
import Head from 'next/head';
import CreatePost from '../components/CreatePost';
const Home = () => {
    return (
        <div>
            <Head>
                <title>Blog App</title>
            </Head>
            <h1>Blog</h1>
            <CreatePost />
        </div>
    )
}
export default Home;