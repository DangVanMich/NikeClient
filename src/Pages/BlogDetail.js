import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../Config/api';
import { FaRegClock, FaRegUser, FaRegHeart, FaRegEye, FaRegComment } from 'react-icons/fa';
import '../Styles/BlogDetail.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [lengthCart, setLengthCart] = useState(0);
    const [viewIncremented, setViewIncremented] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchBlog();
                await fetchCartLength();

                // Increment view count only once when component mounts
                if (!viewIncremented) {
                    await axios.post(`/api/blogs/${id}/views`);
                    setViewIncremented(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, viewIncremented]);

    const fetchCartLength = async () => {
        try {
            const response = await axios.get('/api/cart');
            setLengthCart(response.data.length);
        } catch (error) {
            console.error('Error fetching cart length:', error);
        }
    };

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blogs/${id}`);
            setBlog(response.data);
            // Check if current user has liked this blog
            setIsLiked(response.data.likedBy?.includes(response.data.currentUserEmail));
            setError(null);
        } catch (err) {
            setError('Failed to fetch blog');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/blogs/${id}/like`);
            setBlog((prev) => ({
                ...prev,
                likes: response.data.likes,
            }));
            setIsLiked(true);
            toast.success('Đã thích bài viết!');
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Có lỗi xảy ra khi thích bài viết');
            }
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/blogs/${id}/comments`, {
                content: comment,
                author: commentAuthor,
            });
            setComment('');
            setCommentAuthor('');
            fetchBlog(); // Refresh to get new comment
        } catch (err) {
            console.error(err);
        }
    };

    // if (loading) return <div className="loading">Loading...</div>;
    // if (error) return <div className="error">{error}</div>;
    // if (!blog) return <div className="error">Blog not found</div>;
    if (loading)
        return (
            <>
                <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
                <div className="loading">Loading...</div>
                <Footer />
            </>
        );

    if (error)
        return (
            <>
                <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
                <div className="error">{error}</div>
                <Footer />
            </>
        );

    if (!blog)
        return (
            <>
                <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
                <div className="error">Blog not found</div>
                <Footer />
            </>
        );

    return (
        <>
            <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
            <ToastContainer />
            <div className="blog-detail-container">
                <div className="blog-header">
                    <div className="blog-category">{blog.category}</div>
                    <h1>{blog.title}</h1>
                    <div className="blog-meta">
                        <span>
                            <FaRegUser /> {blog.author}
                        </span>
                        <span>
                            <FaRegClock /> {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                            <FaRegEye /> {blog.views}
                        </span>
                        <span>
                            <FaRegHeart className={isLiked ? 'liked' : ''} /> {blog.likes}
                        </span>
                    </div>
                </div>
                <div className="blog-image">
                    <img src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-content">
                    <div className="blog-excerpt">{blog.excerpt}</div>
                    <div className="blog-body">{blog.content}</div>
                </div>
                <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="blog-actions">
                    <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        <FaRegHeart /> Like
                    </button>
                </div>
                <div className="comments-section">
                    <h2>Comments</h2>
                    <form onSubmit={handleComment} className="comment-form">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit">Post Comment</button>
                    </form>
                    <div className="comments-list">
                        {blog.comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.author}</span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="comment-content">{comment.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogDetail;
